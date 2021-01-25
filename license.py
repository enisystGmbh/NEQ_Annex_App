import json
import os
import platform
import shlex
import subprocess
from collections import OrderedDict
from pathlib import Path

production_licenses_file = Path('production_licenses.json')

def convert_to_git_link(repository):
    if 'git+' in repository:
        repository = repository.split('+')[1]
    if 'ssh://git@' in repository:
        repository = 'https://' + repository.split('@')[1]
    if 'git://' in repository:
        repository = 'https:' + repository.split(':')[1]
    if 'https' not in repository:
        repository = 'https://' + repository
    return repository


def get_production_ids():
    ids = []

    if platform.system() == 'Windows':
        command = shlex.split(f'npx.cmd license-checker --production --json --out {str(production_licenses_file)}')
    else:
        command = shlex.split(f'npx license-checker --production --json --out {str(production_licenses_file)}')

    sp = subprocess.run(command, check=False)
    
    if sp.returncode != 0:
        print(f'Error: license-checker exited with returncode {sp.returncode}')
        exit(1)

    with open(production_licenses_file, 'r') as f:
        ids = list(json.load(f))

    production_licenses_file.unlink()

    return ids


def get_license_text(subdir, file):
    license_path = os.path.join(subdir, file)
    with open(license_path, 'r', encoding="utf-8") as l:
        return l.read()


def get_license_attributes(subdir, file, production_ids):
    json_path = os.path.join(subdir, file)
    with open(json_path, 'r', encoding="utf-8") as j:
        try:
            data = json.load(j)
            id = data['_id']
            if id not in production_ids:
                return None
            print(data,'\n')
            name = data['name']
            version = data['version']
            try:
                repository = convert_to_git_link(data['repository']['url'])
            except:
                repository = "#"
            try:
                license = data['license']
                if type(license) == dict:
                    license = license['type']
            except:
                try:
                    license = data['licenses'][0]['type']
                    if type(license) == dict:
                        license = license['type']
                except:
                    license = ""
        except:
            return None
    return [id, name, version, repository, license]


def get_production_licenses(production_ids):
    licenses = {}
    for subdir, dirs, files in os.walk(rootdir):
        if r'\.bin' not in subdir and r'\.cache' not in subdir and 'package.json' in files:
            dic = {}
            for file in files:
                if 'license' in file or 'LICENSE' in file:
                    dic['text'] = get_license_text(subdir, file)
                elif 'package.json' == file:
                    values = get_license_attributes(subdir, file, production_ids)
                    if values != None:
                        dic['id'] = values[0]
                        dic['name'] = values[1]
                        dic['version'] = values[2]
                        dic['repository'] = values[3]
                        dic['license'] = values[4]
                        if 'text' not in dic:
                            dic['text'] = dic['license']
                    else:
                        dic = {}
            if dic != {}:
                try:
                    licenses[dic['id']] = dic
                except:
                    pass
    return licenses


def save_as_json(license_dict, path):
    license_dict = OrderedDict(
        sorted(license_dict.items(), key=lambda d: (d[1]['name'], d[1]['version'])))

    with open(path, "w") as json_file:
        json.dump(license_dict, json_file)


if __name__ == '__main__':
    page_path = Path('src/app/licenses')
    licenses_file_path = page_path / 'licenses.json'
    rootdir = Path('node_modules')

    production = get_production_ids()
    license_json = get_production_licenses(production)
    save_as_json(license_json, licenses_file_path)

    print(f'Licenses file "{str(licenses_file_path)}" created')