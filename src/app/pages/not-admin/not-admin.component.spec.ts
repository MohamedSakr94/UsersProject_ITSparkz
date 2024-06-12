import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotAdminComponent } from './not-admin.component';

describe('NotAdminComponent', () => {
  let component: NotAdminComponent;
  let fixture: ComponentFixture<NotAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
