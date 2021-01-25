import Cookies from 'js-cookie';

const escapeURL = (str) => escape(str).replaceAll('+', '%2b');

export const getMg = () => {
  if (Cookies.get('mg')) {
    return Cookies.get('mg');
  }

  return '';
};

export const getEniOsBasePath = () => {
  try {
    const pathnameComponents = window.location.pathname.split('/').slice(1);

    return `/${pathnameComponents.slice(0, -2).join('/')}`;
  } catch {
    return '/';
  }
};



export const dwhRequest = async (requests) => {
  const url = 'https://deveniserv.de/enilyser/985DAD48D090/web.dwh';
  const options = {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      Accept: '*/*',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
    body: `mg=${getMg()}`,
  };

  for (const request of requests) {
    if (request.includes('"')) {
      throw new Error(`Doublequotes found in dwh request "${request}"`);
    }

    options.body += `&V=${escapeURL(request)}`;
  }

  const fetchResponse = await fetch(url, options);

  if (!fetchResponse.ok) {
    throw new Error(`${url} could not be fetched (${fetchResponse.status} ${fetchResponse.statusText})`);
  }

  const responseText = await fetchResponse.text();
  const dwhResponses = responseText.split('\r\n').slice(1, -2);

  if (dwhResponses.length !== requests.length) {
    throw new Error(
      `DWH-Error: response count does not match request count (request count: ${requests.length} / response count: ${dwhResponses.length})`,
    );
  }

  return dwhResponses;
};

/**
 * Performs a fetch request expecting a json response
 * @param {String} requestPath
 * @param {Object} parameters
 * @param {Boolean} includeMG
 * @param {Boolean} getRequest
 * @returns {Object} Javascript object from json response
 */
export const fetchJson = async (url, parameters = {}, includeMG = true, getRequest = false) => {
  let requestUrl = url;
  const requestParameters = parameters;
  const options = {
    method: 'POST',
    mode: 'cors',
    credentials: 'same-origin',
    headers: {
      Accept: '*/*',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
  };

  if (getRequest) {
    options.method = 'GET';
  }

  if (includeMG) {
    requestParameters.mg = getMg();
  }

  let parameterString = '';

  for (const [parameterName, parameterValue] of Object.entries(requestParameters)) {
    if (parameterString.length > 0) {
      parameterString += `&${parameterName}=${encodeURIComponent(parameterValue)}`;
    } else {
      parameterString += `${parameterName}=${encodeURIComponent(parameterValue)}`;
    }
  }

  if (parameterString.length > 0) {
    if (getRequest) {
      requestUrl += `?${parameterString}`;
    } else {
      options.body = parameterString;
    }
  }

  const request = await fetch(requestUrl, options);

  if (!request.ok) {
    throw new Error(`Fetch request failed (${request.status}, ${request.statusText})`);
  }

  return request.json();
};

/**
 * Performs a fetch request with the base URL path of the current system
 * @param {String} requestPath
 * @param {Array} parameters
 * @param {Boolean} includeMG
 * @param {Boolean} getRequest
 * @returns {Promise}
 */
export const fetchJsonFromEniOs = async (path, parameters = {}, includeMG = true, getRequest = false) =>
  fetchJson(createEniOsURL(path), parameters, includeMG, getRequest);