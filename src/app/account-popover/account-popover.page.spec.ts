import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AccountPopoverPage } from './account-popover.page';

describe('AccountPopoverPage', () => {
  let component: AccountPopoverPage;
  let fixture: ComponentFixture<AccountPopoverPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountPopoverPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AccountPopoverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
