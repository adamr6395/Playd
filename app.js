//Here is where you'll set up your server as shown in lecture code
import express from 'express';
import session from 'express-session';
const app = express();
import configRoutes from './routes/index.js';
import {create} from 'express-handlebars';
import * as mw from './middleware.js';
import authRoutes from './routes/auth_routes.js';
import gameRoutes from './routes/games.js';
import listsRoutes from './routes/lists.js';



const hbs = create({
  // Specify helpers which are only registered on this instance.
  helpers: {
    eq: (val) => val === "N/A"
  }
});

app.use(
  session({
    name: 'AuthenticationState',
    secret: 'some secret string!',
    resave: false,
    saveUninitialized: false,
  })
);


app.use('/public', express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(mw.rewriteUnsupportedBrowserMethods);

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(mw.logMiddleware);
// app.use(mw.rootMiddleware);

app.use('/signinuser', mw.redirectAuthenticated('/user'));
app.use('/signupuser', mw.redirectAuthenticated('/user'));
app.use('/user', mw.requireAuthentication('/signinuser'));
// app.use('/administrator', mw.adminMiddleware);
app.use('/signoutuser', mw.requireAuthentication('/signinuser'));

app.use('/', authRoutes);
app.use('/', gameRoutes);
app.use('/lists', listsRoutes);

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
