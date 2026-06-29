import type { RegData } from '@types';
import { objectValidator } from '@validators';

export const regDataValidator = (data: unknown): data is RegData =>
  objectValidator<RegData>(
    [
      ['name', 'string'],
      ['password', 'string'],
    ],
    data,
  ) &&
  !!data.password.trim() &&
  !!data.name.trim();
