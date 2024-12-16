import { games } from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import axios from "axios";

export const createGame = async (game_id,name,cover,genres,summary,rating) => {

  // if (typeof name != "string") throw "name sucks";
  // if (typeof cover != "string") throw "cover sucks";
  // if (!Array.isArray(genres)) throw "genres suck";
  // if (typeof summary != "string") throw "summary sucks";
  // if (typeof rating != "number") throw "rating sucks";

  // name = name.trim();
  // cover = cover.trim();
  // summary = summary.trim();

  // for(let i = 0; i < genres.length; i += 1){
  //   if(typeof genres[i] != "string" || genres[i].trim() == "") throw "one of these genres sucks";
  //   genres[i] = genres[i].trim();
  // }

  let newGame = {
    game_id,
    name,
    cover,
    genres,
    summary,
    rating,
    reviews: [],
    score: '0/5',
    total: 0
  }
  const gamesCollection = await games ();
  const insertInfo = await gamesCollection.insertOne(newGame);
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw new Error ('Could not add game');
  return newGame;
}
export const searchGamesByTitle = async (title) => {
  if (!title) {
    throw new Error("Must provide a title");
  }
  if (typeof title !== 'string') {
    throw new Error("title must be a non empty string");
  }
  title = title.trim();
  if (title.length === 0) {
    throw new Error("title must be a non empty string");
  }

  let results = await axios.post(`https://api.igdb.com/v4/games`, `fields name,genres.name,cover.url; search "${title}";`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Client-ID': '8d4vvrtlxxo5feemdcm1o04gc9ey5v',
      'Authorization': 'Bearer v198v1d300ceazaf8t4vyeikjr7xyp',
    },
  })
  return results.data;
};
export const getGameById = async (id) => {
  const gamesCollection = await games();
  const game = await gamesCollection.findOne({ game_id: Number(id) });
  if (game === null) {
    if (!id) {
      throw new Error("Must provide a id");
    }
    if (typeof id !== 'string') {
      throw new Error("id must be a non empty string");
    }
    id = id.trim();
    if (id.length === 0) {
      throw new Error("id must be a non empty string");
    }
    let result = await axios.post(`https://api.igdb.com/v4/games`, `fields id,name, genres.name, summary, rating, cover.url; where id = ${id};`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Client-ID': '8d4vvrtlxxo5feemdcm1o04gc9ey5v',
        'Authorization': 'Bearer v198v1d300ceazaf8t4vyeikjr7xyp',
      },
    })
    let game = result.data[0];
    //console.log(game);
    if (game.cover && game.cover.url) {
      if (game.rating && typeof game.rating === 'number') {
        game.rating = game.rating.toFixed(2); 
      }
      let create = await createGame(game.id, game.name, game.cover.url, game.genres, game.summary, game.rating);
      return create;
    } else {
      // Handle the case where cover is missing
      console.log("Cover image is missing for game ID:", game.id);
      // Optionally, you can set a fallback URL for cover or handle the case differently
      let fallbackCoverUrl = '/public/no_image.jpeg';
      let create = await createGame(game.id, game.name, null, game.genres, game.summary, game.rating);
      return create;
    }
  }
  else {
    console.log('retreived from db');
    return game;
  }
};
/* (not sure about adding these functions)
export const updateGame = async (id, updateData) => {
  const gamesCollection = await games();
  const updatedGame = await gamesCollection.findOneAndUpdate(
    { game_id: Number(id) },
    { $set: updateData },
    { returnDocument: 'after' }
  );
  if (!updatedGame.value) throw new Error(`Game with ID ${id} not found or could not be updated.`);
  return updatedGame.value;
};
export const deleteGame = async (id) => {
  const gamesCollection = await games();
  const deletedGame = await gamesCollection.findOneAndDelete({ game_id: Number(id) });
  if (!deletedGame.value) throw new Error(`Game with ID ${id} could not be deleted.`);
  return deletedGame.value;
};
*/
export const getGamesByGenre = async (genre) => {
  if (!genre) {
    throw new Error("Must provide a genre");
  }
  genre = genre.trim();
  if (genre.length === 0) {
    throw new Error("Genre must be a non-empty string");
  }

  let results = await axios.post(`https://api.igdb.com/v4/games`, `fields id,name, genres.name, summary, rating, cover.url; where genres.name = "${genre}";`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Client-ID': '8d4vvrtlxxo5feemdcm1o04gc9ey5v',
      'Authorization': 'Bearer v198v1d300ceazaf8t4vyeikjr7xyp',
    },
  });
  results.data.forEach(game => {
    if (game.rating && typeof game.rating === 'number') {
      game.rating = game.rating.toFixed(2);
    }
  });
  return results.data;
};

export const getPopularGames = async () => {
  let results = await axios.post(`https://api.igdb.com/v4/games`, `fields id,name, genres.name, summary, rating, cover.url; sort rating desc; limit 10;`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Client-ID': '8d4vvrtlxxo5feemdcm1o04gc9ey5v',
      'Authorization': 'Bearer v198v1d300ceazaf8t4vyeikjr7xyp',
    },
  });
  results.data.forEach(game => {
    if (game.rating && typeof game.rating === 'number') {
      game.rating = game.rating.toFixed(2);
    }
  });

  return results.data;
};
export const getScore = async () => {
  const gamesCollection = await games ();
  const score = await gamesCollection.find({}).sort({ score: -1 }).limit(10).toArray();
  return score;
}
export const getAllGames = async () => {
  const gamesCollection = await games();
  const allGames = await gamesCollection.find({}).toArray();  
  return allGames;
};