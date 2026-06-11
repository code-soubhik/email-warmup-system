
const rateLimitConfig = {
  global: {
    limit: 300,
    window: 60, // seconds
  },

  default: {
    limit: 100,
    window: 60, // seconds
  },

  routes: {
    "/api/auth/request-otp": {
      limit: 5,
      window: 600,
    },

    "/api/hello": {
      limit: 1,
      window: 5,
    },

  } as Record<string, { limit: number; window: number }>,
};

export default rateLimitConfig;