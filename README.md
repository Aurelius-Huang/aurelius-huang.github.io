# ThreeFish K.A.

## Todos

- [x] 在 GitHub 上配置 CI/CD workflow；
- [ ] 更新 Site metadata；

## Features

- XXX

## Environment

<details>
    <summary>Environment Maintenance</summary>

1. Install Node.js

   ```bash
   # installs nvm (Node Version Manager)
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

   # download and install Node.js (you may need to restart the terminal)
   nvm install 20

   # verifies the right Node.js version is in the environment
   node -v # should print `v20.15.0`

   # verifies the right NPM version is in the environment
   npm -v # should print `10.7.0`
   ```

2. Create Project[aurelius-huang]

   ```bash
   npx create-docusaurus@latest aurelius-huang classic --typescript
   ```

3. Install Runtime Packages

   ```bash
   yarn
   ```

4. Start Development Server

   ```bash
   yarn start
   ```

   This command starts a local development server and opens up a browser window. Most changes are reflected live without
   having to restart the server.

5. Build

   ```bash
   yarn build
   ```

   This command generates static content into the `build` directory and can be served using any static contents hosting
   service.

6. Deployment

   ```bash
   USE_SSH=true yarn deploy
   ```

   Not using SSH:

   ```
   GIT_USER=<Your GitHub username> yarn deploy
   ```

   If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to
   the `gh-pages` branch.

</details>
