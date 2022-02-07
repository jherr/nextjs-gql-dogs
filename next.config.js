module.exports = {
  reactStrictMode: true,
  webpack: (config) => {
    if (!config.experiments) {
      config.experiments = {};
    }
    config.experiments.topLevelAwait = true;
    return config;
  },
  images: {
    domains: ["ohspets.shelterbuddy.com"],
  },
};
