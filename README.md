# Yeovil District Hospital - SIDeR Contextual Link Obfuscation Service

[![GitHub Release](https://img.shields.io/github/release/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service.svg)](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/releases/latest/) [![Build Status](https://travis-ci.org/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service.svg?branch=master)](https://travis-ci.org/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service) [![Coverage Status](https://coveralls.io/repos/github/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/badge.svg?branch=master)](https://coveralls.io/github/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service?branch=master) [![Dependabot Status](https://api.dependabot.com/badges/status?host=github&identifier=177117466)](https://dependabot.com) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

# Intro

This is Yeovil District Hospital's contextual link obfuscator, a Node.js application using the Express framework and Black Pear's [obfuscated-querystring](https://github.com/BlackPearSw/obfuscated-querystring).

To provide further security [Helmet](https://helmetjs.github.io/) is used as part of this service.

This has been deployed on a local server that the SIDeR contextual link within the PAS (TrakCare) is pointed at. This was deployed with the assistance of David Suckling (App Support Manager at YDH) and [Will Jehring](https://github.com/wjehring) (Web Developer at Black Pear).

# Prerequisites

-   [Node.js](https://nodejs.org/en/)
-   [Yarn](https://yarnpkg.com)

# Deployment

## Standard deployment

1. Navigate to the repo
2. Run `yarn install` to install dependencies
3. Configure the application in `src/config.js`
4. Run `yarn start`

The Express server should now be up and running on the port set in the config. You should see the following output:

```
ydh-sider-obfuscation-service listening for requests at http://127.0.0.1:8204
```

To quickly test it open a browser of your choice or, if using a request builder (i.e. Insomnia or Postman) create a new GET request, and input the following URL:

http://127.0.0.1:8204?patient=https://fhir.nhs.uk/Id/nhs-number|9467335646&birthdate=1932-04-15&location=https://fhir.nhs.uk/Id/ods-organization-code|RA4&practitioner=https://sider.nhs.uk/auth|frazer.smith@ydh.nhs.uk

Swap out the organization code and email address with your own if you have already been set up an account on the eSP.

In the CLI you will see something similar to the following returned:

```
https://pyrusapps.blackpear.com/esp/#!/launch?location=https://fhir.nhs.uk/Id/ods-organization-code|RA4&practitioner=https://sider.nhs.uk/auth|frazer.smith@ydh.nhs.uk&enc=k01|38a70335f6c1d7d74a5889e107aef5820fb7073fa7dbe553b396272fbf2b30341f49104c167b6990563b283914bf29cbd76b145f204cb65fa7b5caa193bdd74e62a9859856bffeb1031d6e97ac995fe7ab244a0c8bb20113851d54a18633d132
```

Both the patient and birthdate query parameters of the URL have been obfuscated.

The web browser or request builder used should be redirected to Black Pear's ESP site, and once logged in will provide the patient note's for the test patient with NHS Number 9467335646, success!

If the patient, birthdate, location or practitioner parameters are removed from the original URL the obfuscation process and redirect will not occur, and a status 400 will be returned with the message "An essential parameter is missing".

## Deploying using PM2

It is [recommended](https://expressjs.com/en/advanced/pm.html) that you use a process manager such as [PM2](https://pm2.keymetrics.io/) when deploying Express applications like this into production.

1. Navigate to the repo
2. Run `yarn install` to install dependencies
3. Configure the application in `src/config.js`
4. Run `yarn global add pm2` to install pm2 globally
5. Launch application with `pm2 start .pm2.config.js`
6. Check the application has been deployed using `pm2 list` or `pm2 monit`

### To install as a Windows service:

Yeovil District Hospital is heavily invested in Microsoft's ecosystem, as such the service can be deployed on Windows as a service.

1. Run `yarn global add pm2-windows-service` to install [pm2-windows-service](https://classic.yarnpkg.com/en/package/pm2-windows-service)
2. PM2 creates a default PM2 home folder under `C:/Users/<username>/.pm2` after its first run; copy the folder to a system accessible level i.e `C:/.pm2`
3. Create a new PM2_HOME variable at the System level and set the value to `C:/.pm2`
4. Run `pm2 start .pm2.config.js` to start the application
5. Run `pm2 save` to save the process list
6. Run `pm2-service-install` to start as a service

When the service starts or restarts, it will start all the applications saved in the process list.

**Note:** When you change any settings in the configuration file, you will need to restart the service for the changes to take effect.

To uninstall the service run `pm2-service-uninstall`

# Contributing

Please see [CONTRIBUTING.md](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/blob/master/CONTRIBUTING.md) for more details regarding contributing to this project.

# License

`ydh-sider-obfuscation-service` is licensed under the [MIT](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/blob/master/LICENSE) license.
