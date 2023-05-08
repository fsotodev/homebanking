export const environment = {
  version: require('../../package.json').version,
  production: true,
  pushApiPath: 'https://us-central1-push-notifications-prod-242821.cloudfunctions.net/notification',
  apiPath: 'https://us-east4-banco-ripley-app.cloudfunctions.net/apiProd',
  firebaseConfig: {
    apiKey: 'AIzaSyBEqRy5pG9eBhWQwKEarsVh4vumVa8ZZpQ',
    authDomain: 'banco-ripley-app.firebaseapp.com',
    databaseURL: 'https://banco-ripley-app.firebaseio.com',
    storageBucket: 'banco-ripley-app.appspot.com',
    messagingSenderId: '256549462782',
    projectId: 'banco-ripley-app'
  },
};
