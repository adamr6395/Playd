//Here is where you'll set up your server as shown in lecture code
import express from 'express';
import session from 'express-session';
const app = express();
import configRoutes from './routes/index.js';
import {create} from 'express-handlebars';
import * as middleware from './middleware.js';
import authRoutes from './routes/auth_routes.js'


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
app.use(middleware.rewriteUnsupportedBrowserMethods);

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(middleware.logMiddleware);
app.use(middleware.rootMiddleware);

app.use('/signinuser', middleware.signinMiddleware);
app.use('/signupuser', middleware.signupMiddleware);
app.use('/user', middleware.userMiddleware);
app.use('/administrator', middleware.adminMiddleware);
app.use('/signoutuser', middleware.signoutMiddleware);

app.use('/', authRoutes);

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
