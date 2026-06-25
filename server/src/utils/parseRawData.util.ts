import type { WSMessage } from "@types";
import type { RawData } from "ws";

export const parseRawData = (rawData: RawData): WSMessage => JSON.parse(`${rawData}`)
;
