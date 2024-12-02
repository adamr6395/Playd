//Here you will import route files and export them as used in previous labs
import gameRoutes from './games.js';

const constructorMethod = (app) => {
  app.use('/', gameRoutes);

  app.use('*', (req, res) => {
    res.status(404).json({error: 'Route Not found'});
  });
};

export default constructorMethod;
