# Contributing

Contributions are welcome and any help that can be offered is greatly appreciated.
Please take a moment to read the entire contributing guide.

This repository uses the [Feature Branch Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow),
meaning that development should take place in `feat/` branches, with the `master` branch being kept in a stable state.
When you submit pull requests, please make sure to fork from and submit back to `master`.

Other processes and specifications that are in use in this repository are:

-   [Semantic versioning](https://semver.org/)
-   [Conventional commits](https://www.conventionalcommits.org/en/v1.0.0-beta.3/) following the @commitlint/config-conventional config
-   [Prettier](https://prettier.io/) style guide

## Getting Started

As noted in the prerequisites section of the readme file, this project requires that you have Node.js and Yarn installed.

With those in place you can fork the repo and clone it, and then run `yarn install` to install all dependencies.

### Development Workflow

After cloning and installing all the dependencies, there are several commands available for local development:

-   `yarn lint` - Lints everything in src directory
-   `yarn jest` - Runs Jest over all tests in src directory
-   `yarn test` - Runs `yarn lint` and `yarn jest` together
-   `yarn nodemon` - Starts a development server with live reload. Available on `localhost:8204` unless you specify your own PORT.

### Production Workflow

-   `yarn start` - Runs a production version. No live reload.

## Test Setup

1. Configure the application in `src/config.js`
2. Run `yarn nodemon`

The Express server should now be up and running using [nodemon](https://nodemon.io/) on the default port 8204. You should see the following output:

```
Contextual-Link-Parser listening for requests at http://127.0.0.1:8204
```

If an error is returned due to the port already being in use, change the value of the port key in src/config.js.

### Testing

Open a browser of your choice or, if using a request builder (i.e. Insomnia or Postman) create a new GET request, and input the following URL:

http://127.0.0.1:8204?patient=https://fhir.nhs.uk/Id/nhs-number|9467335646&birthdate=1932-04-15&location=https://fhir.nhs.uk/Id/ods-organization-code|RA4&practitioner=https://sider.nhs.uk/auth|frazer.smith@ydh.nhs.uk

Swap out the organization code and email address with your own if you have already been set up an account on the eSP.

In the CLI you will see something similar to the following returned:

```
https://pyrusapps.blackpear.com/esp/#!/launch?location=https://fhir.nhs.uk/Id/ods-organization-code|RA4&practitioner=https://sider.nhs.uk/auth|frazer.smith@ydh.nhs.uk&enc=k01|38a70335f6c1d7d74a5889e107aef5820fb7073fa7dbe553b396272fbf2b30341f49104c167b6990563b283914bf29cbd76b145f204cb65fa7b5caa193bdd74e62a9859856bffeb1031d6e97ac995fe7ab244a0c8bb20113851d54a18633d132
```

Both the patient and birthdate query parameters of the URL have been obfuscated.

The web browser or request builder used should be redirected to Black Pear's ESP site, and once logged in will provide the patient note's for the test patient with NHS Number 9467335646, success!

If the patient, birthdate, location or practitioner parameters are removed from the original URL the obfuscation process and redirect will not occur, and a status 400 will be returned with the message "An essential parameter is missing".

The test listener will stop running once the CLI is exited or the Node.js REPL is terminated using `Ctrl+C`.

## Pull Request Checklist

Prior to submitting a pull request back to the main repository, please make sure you have completed the following steps:

1. Pull request base branch is set to `master`. All pull requests should be forked from and merged back to `master`
2. Run `yarn test` to check the code adheres to the defined style and that it passes the Jest tests
3. Run `yarn prettier` to run the Prettier code formatter over the code

## Release process

When cutting a release, the following steps need to be performed:

1. `package.json` needs to have a version update based on the content being released, remembering to adhere to semantic versioning
2. Generate the changelog with `yarn changelog`
3. Create a release branch with the convention `release/x.x.x`
4. Create a tag for the version; the naming convention is the version (vx.x.x)
5. Push the tag to the repository
6. Draft a release in the release tab with release notes, copying the notes from the changelog

## Issues

Please file your issues [here](https://github.com/Somerset-SIDeR-Programme/ydh-sider-obfuscation-service/issues) and try to provide as much information in the template as possible/relevant.
