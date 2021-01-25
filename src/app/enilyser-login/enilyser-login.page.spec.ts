import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EnilyserLoginPage } from './enilyser-login.page';

describe('EnilyserLoginPage', () => {
  let component: EnilyserLoginPage;
  let fixture: ComponentFixture<EnilyserLoginPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnilyserLoginPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EnilyserLoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
