# Vidly - A Simple Node.js Movie Rental App, backed by MongoDB

This repo contains the code for a simple Node.js app that I build alongside Mosh's [Node.js course](https://codewithmosh.com/p/the-complete-node-js-course).

## Environment Variables
To properly use this app, please set the following environment variables...
- vidly_jwtPrivateKey: (REQUIRED) Set a private key locally for generating JWTs for authenticated users. 
- PORT: (Optional) Whatever port you want to use to run the app. Defaults to 5123.
- DEBUG: (Optional) I recommend that you set this to app:* (in Terminal, run `export DEBUG=app:*`)
    - I use different levels of logging using the debug npm package. Setting this variable will show all levels of logging (info, error, config)
- NODE_ENV: (Optional) Defaults to "development". Although it doesn't really matter since this is a pet project, it's possible to choose one of development, stage, production.
    - The npm config package is used to select the right `.config` file in the /config/ directory depending on this environment variable.

## Repo Contents
- /config/: configurations files used to reference the proper database (MongoDB standalone server)
- /middleware/: custom middleware used to augment request processing pipeline
- /models/: js files that define the schema and model of the MongoDB documents
- /node_modules/: npm modules
- /routes/: API routes build with `express`
- /startup/: startup files for logging, config, db, etc...
- /tests/: unit and integration tests using jest and supertest
- /validations/: joi input validation schemas for the APIs
- index.js: main app that initializes the web server

## Running the App
In the root directory of the repo, run `node index.js` or `nodemon index.js` or `nodemon`.