import { games } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import axios from "axios";
import { getGameById } from './games.js';

export const addReview = async (userId,gameId, stars, review) => {

    if(typeof stars != "number") throw "stars suck";
    if (typeof review != "string") throw "review sucks";

    review = review.trim();

    let gamesCollection = await games();
    let newReview =
    {
        user_id: userId,
        game_id: Number(gameId),
        stars: stars,
        review: review.trim(),
        likes: {}
    }
    let updatedInfo = await gamesCollection.findOneAndUpdate(
        { game_id: Number(gameId) },
        { $push: { reviews: newReview } }
    );
    if (!updatedInfo) throw new Error(`Could not update the game with id ${id}`);
    let game = await getGameById(gameId);
    let newTotal = game.total + stars;
    let avg = 0
    if (game.reviews.length === 0) {
        avg = newTotal;
    }
    else {
        avg = newTotal / game.reviews.length;
    }
    if (Math.trunc(avg) !== avg) {
        avg = avg.toFixed(2);
    }
    let newAvg = `${avg}/5`;
    updatedInfo = await gamesCollection.findOneAndUpdate(
        { game_id: Number(gameId) },
        { $set: { score: newAvg, total: newTotal } }
    );
    if (!updatedInfo) throw new Error(`Could not update the game with id ${gameId}`);
    game = await getGameById(gameId);
    return game;
};

export const updateReview = async (userId,gameId, reviewId, updatedReview) => {
    const gamesCollection = await games();
    const game = await gamesCollection.findOne({ game_id: Number(gameId) });
    if (!game) throw new Error(`Game with ID ${gameId} not found.`);

    const reviewIndex = game.reviews.findIndex(r => r._id.toString() === reviewId);
    if (reviewIndex === -1) throw new Error(`Review with ID ${reviewId} not found.`);

    game.reviews[reviewIndex] = { ...game.reviews[reviewIndex], ...updatedReview };

    const newTotal = game.reviews.reduce((sum, r) => sum + r.stars, 0);
    const newAvg = (newTotal / game.reviews.length).toFixed(2);

    const updatedGame = await gamesCollection.findOneAndUpdate(
        { game_id: Number(gameId) },
        { $set: { reviews: game.reviews, total: newTotal, score: `${newAvg}/5` } },
        { returnDocument: 'after' }
    );

    if (!updatedGame.value) throw new Error('Could not update the review.');
    return updatedGame.value;
};

export const deleteReview = async (gameId, reviewId) => {
    const gamesCollection = await games();
    const game = await gamesCollection.findOne({ game_id: Number(gameId) });
    if (!game) throw new Error(`Game with ID ${gameId} not found.`);

    const reviewIndex = game.reviews.findIndex(r => r._id.toString() === reviewId);
    if (reviewIndex === -1) throw new Error(`Review with ID ${reviewId} not found.`);

    const removedReview = game.reviews.splice(reviewIndex, 1)[0];

    const newTotal = game.reviews.reduce((sum, r) => sum + r.stars, 0);
    const newAvg = game.reviews.length ? (newTotal / game.reviews.length).toFixed(2) : '0.00';

    const updatedGame = await gamesCollection.findOneAndUpdate(
        { game_id: Number(gameId) },
        { $set: { reviews: game.reviews, total: newTotal, score: `${newAvg}/5` } },
        { returnDocument: 'after' }
    );

    if (!updatedGame.value) throw new Error('Could not delete the review.');
    return removedReview;
};
