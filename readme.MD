## Prerequisites

Create a .env file in the project root and add the following variables

-   NODE_ENV - local, development, production
-   PORT - Port number
-   EMAIL_API_KEY - Elastic email API key

We can setup more environments with new NODE_ENV values such as staging, qa etc., and add configuration in env/index.js with new environment value as key name.

## Install

```
npm i
```

## Run

To run the server with nodemon

```
npm start
```

## Run app for Production

```
npm run prod:pm2
```

#### Note:

Checkout `package.json` for other scripts

## Others

#### Wordpress JSON URL

```
/wp-json/wp/v2/posts?per_page=6&order=desc&orderby=date
```

#### Command to rebase dev into master

```
git checkout dev && git pull origin dev && git checkout master && git rebase dev && npm run prod:pm2
```
