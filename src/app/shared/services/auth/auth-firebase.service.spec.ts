import { TestBed } from '@angular/core/testing';

import { AuthFirebaseService } from './auth-firebase.service';

describe('AuthService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthFirebaseService = TestBed.inject(AuthFirebaseService);
    expect(service).toBeTruthy();
  });
});
