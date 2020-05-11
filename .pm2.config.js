// Used by PM2 for deployment
module.exports = {
    apps : [{
        cwd: __dirname,
        env: {
            NODE_ENV: "production",
            PORT: 8204,
            HOST: undefined,
            PFX_PASSPHRASE: undefined,
            PFX_FILE_PATH: undefined,
            SSL_CERT_PATH: undefined,
            SSL_KEY_PATH: undefined
          },
        exec_mode: 'cluster',
        instances: 4,
        name: "sider-obfu",
        script: './src/index.js',
        watch: './src/config.js'
    }]
}