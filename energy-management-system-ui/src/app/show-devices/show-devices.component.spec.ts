import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowDevicesComponent } from './show-devices.component';

describe('ShowDevicesComponent', () => {
  let component: ShowDevicesComponent;
  let fixture: ComponentFixture<ShowDevicesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShowDevicesComponent]
    });
    fixture = TestBed.createComponent(ShowDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
