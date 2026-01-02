type SocketEvent = string | symbol;

interface MockSocket {
  on: (ev: SocketEvent, cb: Function) => void;
  emit: (ev: SocketEvent, payload: any) => void;
  emitServerEvent: (ev: SocketEvent, payload: any) => void;
  getLatestEvent: () => { ev: SocketEvent, payload: any; } | null;
}

const handlers: {
  [ev: SocketEvent]: Function[];
} = {};

let latestEvent: {
  ev: SocketEvent,
  payload: any;
} | null = null;

const socket: MockSocket = {
  on: (ev, cb) => {
    handlers[ev] = (handlers[ev] || []);
    handlers[ev].push(cb);
    console.log(`Added listener for ${ev.toString()}`);
  },

  emit: (ev, payload) => {
    latestEvent = { ev, payload };
    console.log(`Received client event ${ev.toString()}`);
  },

  // Called by tests
  emitServerEvent: (ev, payload) => {
    handlers[ev]?.forEach(fn => fn(payload));
    console.log(`Emitted server event ${ev.toString()}`);
  },

  getLatestEvent: () => latestEvent
};

export default socket;
