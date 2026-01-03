type SocketEvent = string | symbol;

interface MockSocket {
  on: (ev: SocketEvent, cb: Function) => void;
  emit: (ev: SocketEvent, payload: any) => void;

  reset: () => void;
  emitServerEvent: (ev: SocketEvent, payload: any) => void;
  hasReceived: (ev: SocketEvent, payload: any) => boolean;
}

let handlers: {
  [ev: SocketEvent]: Function[];
} = {};

let clientEvents: {
  ev: SocketEvent,
  payload: any;
}[] = [];

const socket: MockSocket = {
  on(ev, cb) {
    handlers[ev] = (handlers[ev] || []);
    handlers[ev].push(cb);
    console.log(`Added listener for ${ev.toString()}`);
  },

  emit(ev, payload) {
    clientEvents.push({ ev, payload });
    console.log(`Received client event ${ev.toString()}`);
  },

  // Called by tests
  reset() {
    handlers = {};
    clientEvents = [];
  },

  emitServerEvent(ev, payload) {
    handlers[ev]?.forEach(fn => fn(payload));
    console.log(`Emitted server event ${ev.toString()}`);
  },

  hasReceived(ev, payload) {
    return clientEvents.includes({ ev, payload });
  }
};

export default socket;
