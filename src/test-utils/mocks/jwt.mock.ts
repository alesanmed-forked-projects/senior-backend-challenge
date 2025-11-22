import { vi } from 'vitest';

export const createJwtServiceMock = () => ({
  sign: vi.fn(),
  verify: vi.fn(),
});
