export const objectValidator = <T extends object>(
  types: Array<[keyof T, string]>,
  data: unknown,
): data is T =>
  typeof data === 'object' &&
  data !== null &&
  types.length === Object.keys(data).length &&
  types.every(({ 0: key, 1: type }) => typeof (data as T)[key] === type);
