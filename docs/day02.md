# Inputs on day 02

## Input 02

I would like to self-host and run the web application in this solution on a dedicated server, running Linux (a recent Fedora version).

Unless better options are presented and argued for, I plan on using a cloudflare tunnel to reach my self hosted machine. I plan on cloning the git repository, performing a build of the solution on the production machine and deploy it to a dedicated production location.
I will also want to create a service so that the application starts automatically when the computer reboots for whatever reasons.

What are some recommendations for setting up the deployment environment?

## Input 02.1

I want to avoid unnecessary rm commands. Please verify before any rm -rf ... that the directory exists

## Input 03

**depoy.sh**

change the script for the following asumptions:

There is no need to perform the updating in the script.
The user is expected to clone / update the git repository manually, navigate to the repository's [scripts] directory and execute the [deploy.sh] from there.
Therefore, the REPO_DIR should attempt to be one directory up from the starting directory.
A verification should be added to ensure that the 2 directories [wt_backend_api] and [wt_frontend] are located in the REPO_DIR and for the script to stop if that condition is not met

## Input 04

Add an option to specify the array of CORS entries in the wt_backend_api's `appsettings.json` file (E.g. under a "RuntimeSettings / CORSOrigins" json node) and to use it to specify the array of entries instead of having them hardcoded in `Program.cs`

## Input 05

The front-end Angular application in the wt_frontend directory uses a hardcoded API url (wt_frontend/src/app/services/weight.service.ts` I would like to also allow customizing the port or expected at runtime.
What would be a proper option to specify this from something like a config file from the deployment directory, or environment variable, or something else to allow a single point of overriding this value ?

## Input 06

The front-end Angular application in the wt_frontend directory uses a hardcoded API url (wt_frontend/src/app/services/weight.service.ts` I would like to also allow customizing the port or expected at runtime.
What would be a proper option to specify this from something like a config file from the deployment directory, or environment variable, or something else to allow a single point of overriding this value ?

## Input 06.1

I might want to add other endpoints and services to the application beyond the "weights". Please change the apiUrl configuration specified in the Angular config.json to only refer to the backend server api common namespace (either http://localhost:5057/api or http://localhost:5057).
Any services using the setting, such as the WeightService need to add their own paths to the endpoint (E.g. "weights" )

## Input 07

(context: deploy.sh)
In the section for the 6th step (Restart Service), add the operation for creating the service configuration file by copying the content from the source config file, specified in the repository's scripts directory. Also adjust the necessary permissions

## Input 07.1

I want the config to be different between the standard development environment and the production environment.
The only difference for now is the setting "apiUrl", which should remain "http://localhost:15057/api" for the development build, but should be (also configurable in a file) "http://localhost:5000/api" for the production build.
Given this requirement, does it still make sense to load the setting for apiUrl from wt_frontend/public/config.json, or is there another standard approach to specivy the environments which should be used ?

## Input 07.2

I did not accept the changes you suggested in deploy.sh I don't think that will work. Please reanalyze.
My reasoning: The angular compilation shall create a js bundle to be served from the wwwroot directory. But that does not have access to the node.js like import and access the file system, that type of include is available at run-time, but beyond that, the files in wwwroot are designed to be served by a web server.
I expect that the port number shall have to be specified pre-compilation bu using settings in wt_frontend/src/environments/ and for one of these files to be selected based on the flags passed to ng build.
