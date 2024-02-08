# hmpps-authorization
[![repo standards badge](https://img.shields.io/badge/dynamic/json?color=blue&style=flat&logo=github&label=MoJ%20Compliant&query=%24.result&url=https%3A%2F%2Foperations-engineering-reports.cloud-platform.service.justice.gov.uk%2Fapi%2Fv1%2Fcompliant_public_repositories%2Fhmpps-authorization)](https://operations-engineering-reports.cloud-platform.service.justice.gov.uk/public-github-repositories.html#hmpps-authorization "Link to report")
[![CircleCI](https://circleci.com/gh/ministryofjustice/hmpps-authorization/tree/main.svg?style=svg)](https://circleci.com/gh/ministryofjustice/hmpps-authorization)

Admin interface for managing clients and users in the new OAuth2 authorization service `hmpps-authorization-server` [here](https://github.com/ministryofjustice/hmpps-authorization-server).


### Note on update to authorization and authentication

At time of this README update (Jan 2024) authorization and authentication services are handled by the full stack Kotlin app  `hmpps-auth`. This also includes a Kotlin frontend for managing clients. 

Due to authorization libraries used by `hmpps-auth` being deprecated authorization functionality is being extracted to its own service `hmpps-authorization-server`.

The frontend for managing clients is being extracted to this repo `hmpps-authorization`.

# Instructions

## Running the app
The easiest way to run the app is to use docker compose to create the service and all dependencies. 

`docker-compose pull`

`docker-compose up`

# Instructions

If this is a HMPPS project then the project will be created as part of bootstrapping - 
see https://github.com/ministryofjustice/dps-project-bootstrap. You are able to specify a template application using the `github_template_repo` attribute to clone without the need to manually do this yourself within GitHub.

This bootstrap is community managed by the mojdt `#typescript` slack channel. 
Please raise any questions or queries there. Contributions welcome!

Our security policy is located [here](https://github.com/ministryofjustice/hmpps-template-typescript/security/policy). 

More information about the template project including features can be found [here](https://dsdmoj.atlassian.net/wiki/spaces/NDSS/pages/3488677932/Typescript+template+project).

## Creating a Cloud Platform namespace

When deploying to a new namespace, you may wish to use this template typescript project namespace as the basis for your new namespace:

<https://github.com/ministryofjustice/cloud-platform-environments/tree/main/namespaces/live.cloud-platform.service.justice.gov.uk/hmpps-template-typescript>

This template namespace includes an AWS elasticache setup - which is required by this template project.

Copy this folder, update all the existing namespace references, and submit a PR to the Cloud Platform team. Further instructions from the Cloud Platform team can be found here: <https://user-guide.cloud-platform.service.justice.gov.uk/#cloud-platform-user-guide>

## Ensuring slack notifications are raised correctly

To ensure notifications are routed to the correct slack channels, update the `alerts-slack-channel` and `releases-slack-channel` parameters in `.circle/config.yml` to an appropriate channel.

### Dependencies
The app requires: 
* hmpps-auth - for authentication
* redis - session store and token caching

### Running the app for development

To start the main services excluding the example typescript template app: 

`docker compose up --scale=app=0`

Install dependencies using `npm install`, ensuring you are using `node v18.x` and `npm v9.x`

Note: Using `nvm` (or [fnm](https://github.com/Schniz/fnm)), run `nvm install --latest-npm` within the repository folder to use the correct version of node, and the latest version of npm. This matches the `engines` config in `package.json` and the CircleCI build config.

And then, to build the assets and start the app with nodemon:

`npm run start:dev`

### Run linter

`npm run lint`

### Run tests

`npm run test`

### Running integration tests

For local running, start a test db and wiremock instance by:

`docker compose -f docker-compose-test.yml up`

Then run the server in test mode by:

`npm run start-feature` (or `npm run start-feature:dev` to run with nodemon)

And then either, run tests in headless mode with:

`npm run int-test`
 
Or run tests with the cypress UI:

`npm run int-test-ui`

## Environment variables

The following environment variables can be set to run the application:

`ENABLE_AUTHORIZATION_CODE` - set to `true` to enable the authorization code grant type. Default is `false`.

`ENABLE_SERVICE_DETAILS` - set to `true` to enable the service details section. Default is `false`.

## Change log

A changelog for the service is available [here](./CHANGELOG.md)

## Dependency Checks

The template project has implemented some scheduled checks to ensure that key dependencies are kept up to date.
If these are not desired in the cloned project, remove references to `check_outdated` job from `.circleci/config.yml`
