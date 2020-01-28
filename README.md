# Yeovil District Hospital - SIDeR Contextual Link Obfuscation Service

[![GitHub Release](https://img.shields.io/github/release/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service.svg)](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/releases/latest/) [![Build Status](https://travis-ci.org/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service.svg?branch=master)](https://travis-ci.org/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service) [![Coverage Status](https://coveralls.io/repos/github/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/badge.svg?branch=master)](https://coveralls.io/github/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service?branch=master) [![Dependabot Status](https://api.dependabot.com/badges/status?host=github&identifier=177117466)](https://dependabot.com) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

# Intro

This is Yeovil District Hospital's contextual link obfuscator, a Node.js script using the Express framework and Black Pear's [obfuscated-querystring](https://github.com/BlackPearSw/obfuscated-querystring), running as a Windows service.

To provide further security [Helmet](https://helmetjs.github.io/) is used as part of this service.

This has been deployed on a local server that the SIDeR contextual link within the PAS (TrakCare) is pointed at. This was deployed with the assistance of David Suckling (App Support Manager at YDH) and [Will Jehring](https://github.com/wjehring) (Web Developer at Black Pear).

# Prerequisites

-   [Node.js](https://nodejs.org/en/)
-   [Yarn](https://yarnpkg.com)

# Deployment

## Enabling Keycloak status_token retrieval

1. Set the values for the Keycloak endpoints in the keycloakRetrieveConfig object in `src/config.js`
2. Uncomment the configureKeycloakRetrival function in `src/app.js`

## Regular deployment (not as a service)

1. Navigate to the repo
2. Run `yarn install` to install dependencies
3. Configure the application in `src/config.js`
4. Run `yarn start`

## Setting up as a Windows Service

Yeovil District Hospital is heavily invested in Microsoft's ecosystem.
As such, this implementation uses the [winser](https://github.com/jfromaniello/winser) package to allow the Node.js application to be deployed as a Windows Service.

### To install as a service:

1. Navigate to the repo
2. Run `yarn install` to install dependencies
3. Configure the application in `src/config.js`
4. Run `yarn install-windows-service` as administrator
5. The service should now be visible in Services

<img src="https://raw.githubusercontent.com/Somerset-SIDeR-Programme/YDH-Obfuscator-Service/master/SIDeR-Windows-Service.png" width="800">

**Note:** When you change any settings in the configuration file, you will need to restart the service for the changes to take effect.

### To uninstall the service:

1. Navigate to the repo
2. Run `yarn uninstall-windows-service` as administrator
3. The service will be uninstalled silently

# Contributing

Please see [CONTRIBUTING.md](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/blob/master/CONTRIBUTING.md) for more details regarding contributing to this project.

# License

`ydh-sider-obfuscation-service` is licensed under the [MIT](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/blob/master/LICENSE) license.
