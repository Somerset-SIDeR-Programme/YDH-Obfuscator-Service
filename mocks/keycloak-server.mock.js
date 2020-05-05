const express = require('express');
const http = require('http');

let mockServer = express();
mockServer.post('/token', (req, res) => {
    res.set({
        'cache-control': 'no-store',
        connection: 'keep-alive',
        pragma: 'no-cache',
        'content-type': 'application/json'
    });

    // Mock user token request return
    if (req.params.audience === 'mock-audience') {
        return res.status(200).send(
            {
                'access_token': 'mock-access-token',
                'expires_in': 900,
                'refresh_expires_in': 0,
                'token_type': 'bearer',
                'not-before-policy': 0,
                'session_state': 'mock-session-state',
                'scope': 'profile email'
              }
        );
    } 

    // Mock service authorisation return
    return res.status(200).send(
        {
            'access_token': 'mock-access-token-authorised',
            'expires_in': 900,
            'refresh_expires_in': 1000,
            'refresh_token': 'mock-refresh-token',
            'token_type': 'bearer',
            'not-before-policy': 0,
            'session_state': 'mock-session-state',
            'scope': 'profile email'
            }
    );
    
});

mockServer = http.createServer(mockServer);
mockServer.listen(3000, () => {
    console.log('Mock KeyCloak server listening on 3000');
});

module.exports = mockServer;