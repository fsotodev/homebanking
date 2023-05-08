// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  version: require('../../package.json').version,
  production: false,
  pushApiPath: 'https://us-central1-push-notifications-dev-242821.cloudfunctions.net/notification',
  apiPath: 'https://us-east4-banco-ripley-app-dev.cloudfunctions.net/apiProd',
  firebaseConfig: {
    apiKey: 'AIzaSyDnZpI2COxg4LYK1ptJnwHIX_WyIXIeP04',
    authDomain: 'banco-ripley-app-dev.firebaseapp.com',
    databaseURL: 'https://banco-ripley-app-dev.firebaseio.com',
    projectId: 'banco-ripley-app-dev',
    storageBucket: 'banco-ripley-app-dev.appspot.com',
    messagingSenderId: '88195623608'
  },
};
