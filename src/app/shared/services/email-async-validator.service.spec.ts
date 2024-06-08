import { TestBed } from '@angular/core/testing';

import { EmailAsyncValidatorService } from './email-async-validator.service';

describe('EmailAsyncValidatorService', () => {
  let service: EmailAsyncValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmailAsyncValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
