import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { logedINGuard } from './loged-in.guard';

describe('logedINGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => logedINGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
