import { JwtService } from '@nestjs/jwt';
import { vi } from 'vitest';

export const createJwtServiceMock = (): JwtService =>
  ({
    sign: vi.fn(),
    verify: vi.fn(),
  }) as unknown as JwtService;
