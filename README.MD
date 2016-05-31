# Simple Node.js starter project with typescript & localization

This starter project contains
 - Typescript & typings
 - i18n-node
 - tape for testing
 - istanbul coverage
 - tslint & eslint
 - Templating by nunjucks
 - express
 - winston for logging

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
`$ npm test:watch` # This will re-run the test when only the test files are modified and saved.

You must name your test `<name>.test.ts` and save the file in the same folder of the file you are testing.

For example, tests for server.ts should be in server.test.ts

    |-- src
      |-- utils.ts
      |-- utils.test.ts
    |-- server.ts
    |-- server.test.ts

### Coverage

`$ npm run coverage`

Running coverage will display the coverage percentage in the console.

It will also create a `./coverage` folder with an index.html where you can view the results in a browser.

## Typescript

### Documentation

Typescript documentation can be found at http://www.typescriptlang.org/docs/tutorial.html

### Configuration

Typescript configuration can be found at http://www.typescriptlang.org/docs/handbook/tsconfig-json.html

### Typings

 - Search for typings: `typings search <name>`

    Ex: `$ typings search react`

 - Install typings: `typings install [<name>=]<location>`

    Ex: `$ typings install node -SG`

## Localization

This project uses [i18n-node](https://github.com/mashpie/i18n-node) for localization.

A couple of ways to change the language:

- Pass the language as a query parameter using `lang` (Ex: http://localhost:3000/?lang=es)
- Set the cookie `lang` with the language (Ex: en-US or es)

In templates, translation can be done by using the `translate` (for regular translations) and `pluralTranslate` (for plural translations) functions:

Ex:

```json
{
	"main_title": "Node.js and Typescript Example",
  "dogs": "[0] no dog|[2,5] some dogs|[6,11] many dogs|[12,36] dozens of dogs|a horde of %s dogs|[100,] too many dogs"
}
```

```html
<div>{{ translate('main_title') }}</div>
<div>{{ pluralTranslate('dogs', 100) }}</div>
```

Expected result:

```html
<div>Node.js and Typescript Example</div>
<div>too many dogs</div>
```

## Some of Modules installed

### nunjucks

 A Node.js and Browser-based JavaScript Template Engine.
 Documentation available at http://mozilla.github.io/nunjucks/.

### i18n-node

Lightweight simple translation module for node.js / express.js with dynamic json storage. Uses common __('...') syntax in app and templates.
Documentation available at https://github.com/mashpie/i18n-node.

### express

Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
More information is available at http://expressjs.com/.

### helmet

 Help secure Express apps with various HTTP headers. Documentation can be found at https://github.com/helmetjs/helmet.

### winston

A simple and universal logging library. Documentation can be found at https://github.com/winstonjs/winston.

### nconf

Hierarchical node.js configuration with files, environment variables, command-line arguments, and atomic object merging.
Documentation can be found at https://www.npmjs.com/package/nconf

### cross-env:

This micro-lib allows you to provide a script which sets an environment using unix style and have it work on windows too.

### tape

I decided to use the Tape test module after reading https://medium.com/javascript-scene/why-i-use-tape-instead-of-mocha-so-should-you-6aa105d8eaf4#.mo56gj6jk.

#### tape-watch

Auto-test runner for tape.

#### tape-spec

Formatted TAP output like Mocha's spec reporter.

### istanbul

Used for code coverage. Documentation can be found at https://gotwarlost.github.io/istanbul/.

### nodemon

Nodemon is a utility that will monitor for any changes in your source and automatically restart the server. Documentation can be found at http://nodemon.io/.

### concurrently

Run commands concurrently cross platform. With the `--kill-others` switch, all commands are killed if one dies.

### debug

Used to output debugging messages
