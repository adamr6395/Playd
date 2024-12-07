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
    return game;
}