import { TestBed } from '@angular/core/testing';

import { TipoComercioService } from './tipo-comercio.service';

describe('TipoComercioService', () => {
  let service: TipoComercioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoComercioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
