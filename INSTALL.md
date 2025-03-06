
## How to install.

- Download from repo.
- Install pnpm (a better npm) - `npm install -g pnpm`
- `cd {REPO_HOME}`
- `pnpm install`
- Copy `.env-example` to `.env` and update the following entries with values Rob will provide you in slack:

- API_TOKEN="SECRET ACCESS TOKEN"

With any luck, you should be able to run a copy of the new website locally.

To start the server, type `npm run dev`

## Nice To Haves

- Postman - To develop and test graphql queries to backend.
- VSCode Extensions
  - Svelte Auto Import - Automatically finds, parses and provides code actions and code completion for all available imports.
  - Svelte for VS Code - Svelte language support for VS Code.
  - Svelte Intellisense - Provides intellisense for data, events, slots etc. in components.
  - Vite - VS Code for Vite