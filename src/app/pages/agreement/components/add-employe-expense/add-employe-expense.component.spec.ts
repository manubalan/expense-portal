import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmployeExpenseComponent } from './add-employe-expense.component';

describe('AddEmployeExpenseComponent', () => {
  let component: AddEmployeExpenseComponent;
  let fixture: ComponentFixture<AddEmployeExpenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEmployeExpenseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEmployeExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
