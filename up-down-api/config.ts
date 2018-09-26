const configs = {
  staging: {
    port: 3000,
  },

  production: {
    port: 5000,
  }
};

const env = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV.toLowerCase() : 'staging';

const config = env in configs ? configs[env] : configs.staging;

export default { env, ...config };
