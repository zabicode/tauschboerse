import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FigureCreateComponent } from './figure-create.component';

describe('FigureCreateComponent', () => {
  let component: FigureCreateComponent;
  let fixture: ComponentFixture<FigureCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FigureCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FigureCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
