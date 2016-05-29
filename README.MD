# Simple Node.js starter project with typescript & localization

## Installation

Globally install the following modules so you can use them in the command line:

- `$ npm install -g typescript`
- `$ npm install -g typings`
- `$ npm install -g eslint`

Setup your IDE (if you didn't already):
- Enable typescript to read from tsconfig.json
- Enable tslint to read from tslint.json
- Enable eslint to read from .eslintrc

Setup the project:

`$ npm install && typings install`

## How to run

### Start the app in dev mode

`$ npm run dev`

### Running Tests

`$ npm test`

You must name your test `<name>.test.ts` and save the file in the same folder of the file you are testing.

For example, tests for server.ts should be in server.test.ts

    |-- src
      |-- utils.ts
      |-- utils.test.ts
    |-- server.ts
    |-- server.test.ts

### Coverage

`$ npm run cover`

Running coverage will display the coverage percentage in the console.

It will also create a coverage folder with an index.html where you can view the results in a browser.

## Typescript

### Documentation

Typescript documentation can be found at http://www.typescriptlang.org/docs/tutorial.html

### Configuration

http://www.typescriptlang.org/docs/handbook/tsconfig-json.html

### Typings

 - Search for typings: `typings search <name>`

    Ex: `$ typings search react`

 - Install typings: `typings install [<name>=]<location>`

    Ex: `$ typings install node -SG`

## Some of Modules installed

### nunjucks

 A Node.js and Browser-based JavaScript Template Engine.
 Documentation available at http://mozilla.github.io/nunjucks/

### i18next

i18next is a very popular internationalization framework for browser or any other javascript environment.
Documentation available at http://i18next.com/docs/

### express

Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
More information is available at http://expressjs.com/

### helmet

 Help secure Express apps with various HTTP headers. Documentation at https://github.com/helmetjs/helmet

### winston

A simple and universal logging library. Documentation at https://github.com/winstonjs/winston

### nconf

Hierarchical node.js configuration with files, environment variables, command-line arguments, and atomic object merging.

### cross-env:

This micro-lib allows you to provide a script which sets an environment using unix style and have it work on windows too

### tape

I decided to use the Tape test  module after reading https://medium.com/javascript-scene/why-i-use-tape-instead-of-mocha-so-should-you-6aa105d8eaf4#.mo56gj6jk

### isparta

Used for code coverage
