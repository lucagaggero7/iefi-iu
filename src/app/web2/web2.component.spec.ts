import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Web2Component } from './web2.component';

describe('Web2Component', () => {
  let component: Web2Component;
  let fixture: ComponentFixture<Web2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Web2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Web2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
