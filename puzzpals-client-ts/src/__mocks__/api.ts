interface MockApi {
  get: (url: string) => Promise<MockResponse>;
  post: (url: string) => Promise<MockResponse>;
}

interface MockResponse {
  data: null | {
    room: string;
  };
}

const api: MockApi = {
  async get(url) {
    switch (url) {
      case '/rooms/TestRm':
        return { data: { room: 'TestRm' } };
      default:
        return { data: null };
    }
  },

  async post(url) {
    switch (url) {
      case '/rooms/TestRm/join':
        return { data: { room: 'TestRm' } };
      case '/rooms/TestRm/leave':
        return { data: null };
      default:
        return { data: null };
    }
  }
};

export default api;
