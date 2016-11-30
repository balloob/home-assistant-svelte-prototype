import App from './components/App.html';
import {
  createConnection,
  subscribeEntities,
} from 'home-assistant-js-websocket';

var app = new App({
  target: document.querySelector( '.page-content' ),
  data: {
    entities: {}
  }
});

createConnection('ws://localhost:8123/api/websocket').then(conn => {
  app.set({conn});

  subscribeEntities(
    conn,
    entities => {
      console.log(entities);
      app.set({entities});
    });
});
