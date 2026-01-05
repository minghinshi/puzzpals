function requireEnv(name) {
    const value = import.meta.env[name];
    if (!value) {
        throw new Error(`Missing environment variable: ${name}.` +
            " Refer to .env.example for an example configuration.");
    }
    return value;
}

const config = {
  apiBase: requireEnv('VITE_API_BASE'),
  apiWs: requireEnv('VITE_API_WS')
};

export default config;
