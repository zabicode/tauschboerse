import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FigureDetailsComponent } from './figure-details.component';

describe('FigureDetailsComponent', () => {
  let component: FigureDetailsComponent;
  let fixture: ComponentFixture<FigureDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FigureDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FigureDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
