//import express and express router as shown in lecture code and worked in previous labs.  Import your data functions from /data/movies.js that you will call in your routes below
import express from 'express';
const router = express.Router();
import * as moviesData from '../data/games.js'
import validation from '../helpers.js'
router.route('/').get(async (req, res) => {
  //code here for GET will render the home handlebars file
  try{
    res.render('home');
  }
  catch(e){
    res.status(500).json({error: 'cannot load page'});
  }
});

router.route('/gameSearch').post(async (req, res) => {
  //code here for POST this is where your form will be submitting searchByTitle and then call your data function passing in the searchByTitle and then rendering the search results of up to 50 Movies.
  let movie = req.body.searchByTitle;
  try{
  movie = validation.checkString(movie,'Game Title');
  try{
    let searchResults = await moviesData.searchGamesByTitle(movie);
    res.render('searchResults',{movies: searchResults, movie});
  }
  catch(e){ 
    res.status(404).render('searchResults',{movie});
  }
  }
  catch(e){
    res.status(400);
    res.render('searchResults',{movie: 0});
  }
});

router.route('/getGame/:id').get(async (req, res) => {
  //code here for GET a single movie
  let id = req.params.id
  try{
    id = validation.checkString(id, 'gameId');
    try{
      let movieInfo = await moviesData.getGameById(id);
      res.render('getgame', {movie: movieInfo});
    }
    catch(e){
      res.status(404).render('getgame',{movie: ''});
    }
  }
  catch(e){
    res.status(400).json({error: 'Invalid input'});
  }
});

//export router
export default router;