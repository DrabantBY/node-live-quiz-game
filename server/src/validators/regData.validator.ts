import type { RegData } from "@types";


const REG_DATA_TYPES = [{key: 'name', type: 'string'}, {key: 'password', type: 'string'}];

export const regDataValidator = (data: unknown): data is RegData =>

 typeof data === "object" && data !== null && REG_DATA_TYPES.length === Object.keys(data).length &&
    REG_DATA_TYPES.every(({ key, type }) => typeof (data as Record<string, unknown>)[key] === type);
