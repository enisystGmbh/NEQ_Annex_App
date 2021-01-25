import { TestBed } from '@angular/core/testing';

import { TabnavService } from './tabnav.service';

describe('TabnavService', () => {
  let service: TabnavService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TabnavService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
