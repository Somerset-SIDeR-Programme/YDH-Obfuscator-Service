Yeovil District Hospital - SIDeR Contextual Link Obfuscator Service
==========================================
[![Known Vulnerabilities](https://snyk.io/test/github/Somerset-SIDeR-Programme/YDH-Obfuscator-Service/badge.svg?targetFile=package.json)](https://snyk.io/test/github/Somerset-SIDeR-Programme/YDH-Obfuscator-Service?targetFile=package.json)

## Intro
This is Yeovil District Hospital's contextual link obfuscator, a Node.js script using the Express framework and BlackPear's [obfuscated-querystring](https://github.com/BlackPearSw/obfuscated-querystring), running as a Windows service.

This will be running on a local server that the SIDeR contextual link within our PAS (TrakCare) will be pointed at.

## Prerequisites

[Node.js](https://nodejs.org/en/) if you do not already have it installed.


## Test Setup
1. Download this repository from Github
2. Navigate to the repo directory using a CLI (after it has been extracted if downloaded as ZIP)
3. Run `npm install`
4. Run `npm run nodemon`

The Express server should now be up and running using [nodemon](https://nodemon.io/) on the default port 8204. You should see the following output:

```
Contextual-Link-Parser listening for requests at http://127.0.0.1:8204
```
If an error is returned due to the port already being in use, change the value of the port key in the serverConfig object in app.js.

## Testing
Open a browser of your choice or, if using a request builder (i.e. Postman) create a new GET request, and input the following URL:

http://127.0.0.1:8204?patient=https://fhir.nhs.uk/Id/nhs-number|9467335646&birthdate=1932-04-15&location=https://fhir.nhs.uk/Id/ods-organization-code|RA4&practitioner=https://sider.nhs.uk/auth|frazer.smith@ydh.nhs.uk

swap out the organization code and email address with your own if you have already been set up an account on the eSP.

In the CLI you will see something similar to the following returned:

```
https://pyrusapps.blackpear.com/esp/#!/launch?location=https://fhir.nhs.uk/Id/ods-organization-code|RA4&practitioner=https://sider.nhs.uk/auth|frazer.smith@ydh.nhs.uk&enc=k01|38a70335f6c1d7d74a5889e107aef5820fb7073fa7dbe553b396272fbf2b30341f49104c167b6990563b283914bf29cbd76b145f204cb65fa7b5caa193bdd74e62a9859856bffeb1031d6e97ac995fe7ab244a0c8bb20113851d54a18633d132
```

Both the patient and birthdate query parameters of the URL have been obfuscated.

The web browser or request builder used should be redirected to Black Pear's ESP site, and once logged in will provide the patient note's for the test patient with NHS Number 9467335646, success!

If the patient, birthdate, location or practitioner parameters are removed from the original URL the obfuscation process and redirect will not occur, and a status 400 will be returned with the message "An essential parameter is missing". 



## Setting up as a Windows Service
The test listener will stop running once the CLI is exited or the Node.js REPL is terminated using `Ctrl+C`, which isn't ideal.
As such this implementation uses the [winser](https://github.com/jfromaniello/winser) package to set up the Node.js application
as a Windows Service.

### To install as a service:
1. Navigate to the repo
2. Run `npm run install-windows-service` as administrator
3. A prompt will appear asking for confirmation of installation type `y` and hit enter

The service should now be visible in Services:

<img src="https://raw.githubusercontent.com/Somerset-SIDeR-Programme/YDH-Obfuscator-Service/master/SIDeR-Windows-Service.png" width="800">


### To uninstall the service:
1. Navigate to the repo
2. Run `npm run uninstall-windows-service` as administrator
3. The service will be uninstalled silently
