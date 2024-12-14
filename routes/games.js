//import express and express router as shown in lecture code and worked in previous labs.  Import your data functions from /data/movies.js that you will call in your routes below
import express from 'express';
const router = express.Router();
import * as gamesData from '../data/games.js'
import * as reviewsData from '../data/reviews.js'
import validation from '../helpers.js'
router.route('/').get(async (req, res) => {
  //code here for GET will render the home handlebars file
  try{
    res.render('home', {title:'Playd'});
  }
  catch(e){
    res.status(500).json({error: 'cannot load page'});
  }
});

router.route('/gameSearch').post(async (req, res) => {
  //code here for POST this is where your form will be submitting searchByTitle and then call your data function passing in the searchByTitle and then rendering the search results of up to 50 Movies.
  let game = req.body.searchByTitle;

  try{
    let results = await gamesData.searchGamesByTitle(game);
    if(!results || results.length === 0){
      return res.status(404).render('error', {
        isNotFoundError: true,
        title:"error",
        errorMessage: `We're sorry, but no results were found for "${game}".`
      });
    }
    res.render('searchResults',{ title:'gameSearch',games: results, game});
  } catch(e) { 
    res.status(500).render('error', {
      isServerError: true,
      title:"error",
      errorMessage: e.message || "An unexpected error occurred."
    });
  }
});

router.route('/getGame/:id').get(async (req, res) => {
  let id = req.params.id
  try{
    let gameInfo = await gamesData.getGameById(id);
    res.render('getgame', {game: gameInfo,title:'getgame'});
  }
  catch(e){
    return res.status(404).render('error', {
      isServerError: true,
      title:"error",
      errorMessage: "No Game found with that id"
    });
  }
});
router.route('/getGame/:id').post(async (req, res) => {
  let id = req.params.id
  let {stars,review} = req.body;
  try{
    let gameInfo = await reviewsData.addReview(id,Number(stars),review);
    res.render('getgame', { game: gameInfo, title:'getgame'});
  }
  catch(e){
    return res.status(404).render('error', {
      isServerError: true,
      title:"error",
      errorMessage: "No Game found with that id"
    });
  }
});
//export router
export default router;