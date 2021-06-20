import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVehicleExpensesComponent } from './add-vehicle-expenses.component';

describe('AddVehicleExpensesComponent', () => {
  let component: AddVehicleExpensesComponent;
  let fixture: ComponentFixture<AddVehicleExpensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddVehicleExpensesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVehicleExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
