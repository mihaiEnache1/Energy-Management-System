import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowMyDevicesComponent } from './show-my-devices.component';

describe('ShowMyDevicesComponent', () => {
  let component: ShowMyDevicesComponent;
  let fixture: ComponentFixture<ShowMyDevicesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShowMyDevicesComponent]
    });
    fixture = TestBed.createComponent(ShowMyDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
