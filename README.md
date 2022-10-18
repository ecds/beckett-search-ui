# beckett-search-ui

The frontend for the ECDS Beckett Letters project, built with React and Searchkit/ElasticSearch, bundled with Vite, and using the [beckett-data-api](https://github.com/ecds/beckett-data-api) developed by Jay Varner.

## Requirements

- Node.JS v16.x
- NPM v8.x

This project uses [Volta](https://volta.sh/) to pin Node and NPM versions, and [Vite](https://vitejs.dev/) as a bundler.

## Development

### Getting started

To start developing on this project, first install the dependencies with NPM:

```sh
npm install
```

Then, you must configure environment variables. Copy the sample file to `.env.local`:

```sh
cp .env.local.sample .env.local
```

Edit the new `.env.local` file with the required values. This file will not be checked into Git.

### Scripts

#### `npm run dev`

Runs the project in development mode, with hot module reloading, served from `http://localhost:5173/`.

#### `npm run build`

Builds the project as a static site and saves the output to the `./dist` directory.

#### `npm run preview`

(must be run after `build`) Serves the built output from the `./dist` directory on a local web server.

### Code style and linting

This project uses ESLint to manage code style, catch errors, and enforce consistency.


If you are using VSCode, you may wish to install the [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint). Then, you can create a file called `.vscode/settings.json`. Using the below settings, you can specify that ESLint will auto-fix any style errors on saving a file:

```json
{
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
    },
    "eslint.validate": ["javascript"]
}
```
