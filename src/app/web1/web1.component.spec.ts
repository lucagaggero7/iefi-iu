import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Web1Component } from './web1.component';

describe('Web1Component', () => {
  let component: Web1Component;
  let fixture: ComponentFixture<Web1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Web1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Web1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
