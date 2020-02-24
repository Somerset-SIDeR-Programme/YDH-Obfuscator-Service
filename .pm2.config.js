// Used by PM2 for deployment
module.exports = {
    apps : [{
        cwd: __dirname,
        env: {
            NODE_ENV: "production"
          },
        exec_mode: 'cluster',
        instances: 4,
        name: "sider-obfu",
        script: './src/app.js'
    }]
}