import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapDevicesComponent } from './map-devices.component';

describe('MapDevicesComponent', () => {
  let component: MapDevicesComponent;
  let fixture: ComponentFixture<MapDevicesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MapDevicesComponent]
    });
    fixture = TestBed.createComponent(MapDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
