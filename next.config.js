module.exports = {
    devIndicators: {
        autoPrerender: false,
    },
    env: {
        API_URL: process.env.API_URL,
        GEO_URL: process.env.GEO_URL,
        VWORLD_KEY: process.env.VWORLD_KEY
    },
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.node = {
                fs: 'empty'
            }
        }
        return config;
    }
};