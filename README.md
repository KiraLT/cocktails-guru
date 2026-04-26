# Cocktails Guru

This repository houses the code for the Cocktails Guru website, a project dedicated to cocktail lovers around the globe. Here you'll find all sorts of cocktail recipes to try and enjoy.

## Requesting Recipes

If you'd like to request a new cocktail recipe to be added to the website, please use the following link to create a new issue:

[Request a Recipe](https://github.com/KiraLT/cocktails-guru/issues/new?assignees=&labels=&projects=&template=reciple-request.md&title=)

Make sure to fill out the issue template with as much detail as possible.

## Pre-requisites

This project uses pnpm for dependency management and Node.js for the runtime environment. Please ensure that you have these installed on your system before proceeding:

- Node.js (version 22 or newer)
- pnpm (via Corepack)

## Getting Started

### Install dependencies

Install the required dependencies:

```bash
corepack enable
pnpm install
```

### Start the development server

To start the development server, use the following command:

```bash
pnpm run dev
```

Your local copy of the project should now be running at `http://localhost:3000`.

### Building for production

When you're ready to build the project for production, use the following command:

```bash
pnpm run build
```

This will create a production-ready version of the project in the `dist/` directory.

### Preview the production build

```bash
pnpm run preview
```

### Lint and format

```bash
pnpm run lint
pnpm run lint:biome
pnpm run format:biome
```
