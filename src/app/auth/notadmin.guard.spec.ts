import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { notadminGuard } from './notadmin.guard';

describe('notadminGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => notadminGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
