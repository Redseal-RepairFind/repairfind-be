# REPAIRFIND BACKEND


``` json
 "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "nodemon src/index.ts",
    "js-dev": "nodemon dist/index.ts",
    "build": "rm -rf ./dist && tsc && npm run copy-files",
    "copy-files": "npx copyfiles .env dist/ package.json dist/ package-lock.json dist/ ecosystem.config.js dist/ command.js dist/",
    "start": "node dist/index.js",
    "build-start": "node dist/index.js"
  },
  ```

  ```json
`  "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "dev": "nodemon src/index.ts",
        "js-dev": "nodemon dist/index.ts",
        "build": "rm -rf ./dist && tsc && npm run copy-files",
        "copy-files": "npx copyfiles .env dist/ package.json dist/ package-lock.json dist/ ecosystem.config.js dist/ command.js dist/",
        "start": "node dist/index.js",
        "build-start": "npm run build && npm start", // Builds and starts the application in production mode
        "deploy": "npm run build-start" // Script for deploying to DigitalOcean
    }
```

<!-- npx copyfiles src/i18n/translations/* -u 1 dist/ &&  -->
<!-- "translate": "^1.4.1", -->
    <!-- "copy-files": "npx copyfiles .env package.json package-lock.json ecosystem.config.js cli.js dist/", -->
