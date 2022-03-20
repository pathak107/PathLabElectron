# PathLabLite
PathLabLite is a desktop application for all the pathology lab tests needs.

## Features:
- Manage Test Data, create your own tests add their parameters.
- Report generation. User can fill the results of a test in report and a PDF will be generated automatically.
- Bill generation. UI gives a simple way of creating new bill, simply add info about patient and the tests required and done, the software will generate a bill PDF which can be printed.


## Tech Stack
- Electron.js (Only windows is supported for now)
- React
- Chakra UI (CSS component library for react)
- Sequelize and Sqlite
- EJS (To convert html templates into html for pdf generation)
- Electron-store (For storing app settings)
- Electron-builder (For packaging, distributing and auto update)

## Yet to implement
- Feature: Upload report pdfs to web, generate a URL and send the URL to the patient via an SMS.
- electron-logger for better logging and a way to notify when some error occurs during production
- Auto pulling of Test data from a server when new Test Data is published.

## How to use
### Development
1. Clone the repo and install the required npm dependencies using `npm install` in both the root directory and public directory.
2. All the react code is in ./src and electron code is in ./public/src
3. Run `npm start` at root dir to start the local dev server for react.
4. Once react app is running `cd public` and run `npm run electron` or `npm start`

### Package
1. Run `npm build` this will create an optimized build for react app.
2. `cd build` and `npm run dist` will generate a dist folder in build folder which will have the installer.

### Release for windows on linux
1. Run `npm build` this will create an optimized build for react app.
2. `cd build`
3. Change the publish key in package.json as per your github.
4. Run the following command to run a docker container with volume attached as your current directory. Remember to pass github access token `GH_TOKEN=<your token>` if not present as env variable on your system.
`sudo docker run --rm -ti --env ELECTRON_CACHE="/root/.cache/electron"  --env ELECTRON_BUILDER_CACHE="/root/.cache/electron-builder" --env GH_TOKEN=$GH_TOKEN -v ${PWD}:/project  -v ${PWD##*/}-node-modules:/project/node_modules  -v ~/.cache/electron:/root/.cache/electron  -v ~/.cache/electron-builder:/root/.cache/electron-builder  electronuserland/builder:wine`
5. Once inside the container run `npm run publish`. This will build the app and produce a github release draft.
