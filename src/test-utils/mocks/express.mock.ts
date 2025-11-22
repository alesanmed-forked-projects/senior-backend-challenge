import { vi } from 'vitest';

export const createResponseMock = () => {
  const res = {
    status: vi.fn(),
    send: vi.fn(),
    json: vi.fn(),
  };

  res.status.mockImplementation(() => res);
  res.send.mockImplementation(() => res);
  res.json.mockImplementation(() => res);

  return res;
};
