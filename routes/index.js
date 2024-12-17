import gameRoutes from './games.js';
import authRoutes from "./auth_routes.js";
import listRoutes from "./lists.js";

const constructorMethod = (app) => {
  app.use('/getgame', gameRoutes);
  app.use('/signinuser', authRoutes);
  app.use('/gamelist', listRoutes);


  app.use('*', (req, res) => {
    res.status(404).render('error', {
      isServerError: true,
      title: "error",
      errorMessage: "Route Not found"
    });
  });
};

export default constructorMethod;
