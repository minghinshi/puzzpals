import { io, Socket } from "socket.io-client";

export default class ClientWrapper {
  private readonly socket: Socket
  private readonly receivedEvents: Array<{ ev: string; payload: any }> = [];

  constructor() {
    const url = process.env.TEST_SOCKET_URL;
    this.socket = io(url);
  }

  emit(event: string, ...args: any[]) {
    return this.socket.emit(event, ...args);
  }

  close() {
    return this.socket.close();
  }

  waitFor(ev: string) {
    return new Promise<void>(resolve => this.socket.once(ev, () => resolve()));
  }

  listenTo(ev: string) {
    this.socket.on(ev, payload => this.receivedEvents.push({ ev, payload }));
  }

  hasReceived(ev: string, payload: any) {
    return this.receivedEvents.some(r => r.ev === ev && JSON.stringify(r.payload) === JSON.stringify(payload));
  }
}