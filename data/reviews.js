import { games } from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import axios from "axios";
import { getGameById } from './games.js'; 

export const addReview = async (id,stars,review) => {
    let gamesCollection = await games(); 
    let newReview = 
    {
        game_id: Number(id),
        stars: stars,
        review: review.trim()
    }
    let updatedInfo = await gamesCollection.findOneAndUpdate(
        {game_id: Number(id)},
        {$push: {reviews:newReview}}
    );
    if (!updatedInfo) throw new Error( `Could not update the game with id ${id}`);
    let game = await getGameById(id);
    let newTotal = game.total + stars;
    let avg = 0
    if(game.reviews.length === 0){
         avg = newTotal;
    }
    else{
         avg = newTotal/game.reviews.length;
    }
    if(Math.trunc(avg) !== avg){
        avg = avg.toFixed(2);
    }
    let newAvg = `${avg}/5`;
     updatedInfo = await gamesCollection.findOneAndUpdate(
        {game_id: Number(id)},
        {$set: {score: newAvg,total:newTotal}}
    );
    if (!updatedInfo) throw new Error( `Could not update the game with id ${id}`);
    game = await getGameById(id);
    return game;
}