import { loadApp } from './loaders/app';

(async () => {
  const app = await loadApp();

  app.listen(3001, () =>
    console.log(`Application is running on http://localhost:3001`),
  );
})();
