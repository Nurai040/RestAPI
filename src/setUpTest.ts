import { loadApp } from './loaders/app';
import { Server } from 'http';

let server: Server;

export async function setUpTest(): Promise<Server> {
  const app = await loadApp();
  server = app.listen(3007, () =>
    console.log(`Test server is running on http://localhost:3001`),
  );
  return server;
}

export async function tearDownTest(): Promise<void> {
  if (server) {
    server.close();
  }
}
