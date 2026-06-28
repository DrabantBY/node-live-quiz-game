import { randomUUID } from "node:crypto";
import { users } from "@store";
import type { WSMessage } from "@types";
import { sendWsMessage } from "@utils";
import { regDataValidator } from "@validators";
import type { WebSocket } from "ws";

export const loginService = (ws: WebSocket, { type, data, id }: WSMessage): void => {
  if (!regDataValidator(data)) {
    sendWsMessage(ws, { type, data: {name: '', index: -1, error: true, errorText: "Invalid data" }, id });
    return;
  };

  const { name, password } = data;

  if(!name.trim() || !password.trim()) {
    sendWsMessage(ws, { type, data: { name, index: -1, error: true, errorText: "Name and password are required" }, id });
    return;
  }

  const user = users.get(name);

  if (!user) {
    const index = randomUUID();
    users.set(name, { index, name, password });
    sendWsMessage(ws, { type, data: {name, index, error: false, errorText: "" }, id });
    return;
  }

  if (user.password !== password) {
    sendWsMessage(ws, { type, data: {name, index: -1, error: true, errorText: "Invalid password. Try again" }, id });
    return;
  }

  sendWsMessage(ws, { type, data: {name: user.name, index: user.index, error: false, errorText: "" }, id });
  return ;
};
