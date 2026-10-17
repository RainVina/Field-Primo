import { render } from 'preact';
import { App } from './app';
import { requestPersistence } from './lib/storage';
import { AppProvider } from './state';
import './styles.css';

requestPersistence();

render(
  <AppProvider>
    <App />
  </AppProvider>,
  document.getElementById('app')!,
);
