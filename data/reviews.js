import { games, users } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import axios from "axios";
import { getGameById } from './games.js';

export const addReview = async (userId,gameId, stars, review) => {

    if(typeof stars !== "number") throw "stars suck";
    if (typeof review !== "string") throw "review sucks";

    review = review.trim();

    let gamesCollection = await games();
    let newReview =
    {
        user_id: userId,
        game_id: Number(gameId),
        stars: stars,
        review: review.trim(),
        likes: [],
        dislikes: []
    }
    let updatedInfo = await gamesCollection.findOneAndUpdate(
        { game_id: Number(gameId) },
        { $push: { reviews: newReview } }
    );
    if (!updatedInfo) throw new Error(`Could not update the game with id ${id}`);
    let userCollection = await users();
    const date = new Date();
    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    let userReview = {
        game_id: Number(gameId),
        stars: stars,
        review: review.trim(),
        date: formattedDate // Store review date for tracking
    };
    
    let updatedUserInfo = await userCollection.findOneAndUpdate(
        { userId: userId },
        { $push: { reviews: userReview } }, // Add the review to the user's "reviews" array
        { returnDocument: 'after' } // Optional: Get the updated user document
    );
    if (!updatedUserInfo) {
        throw new Error(`Could not update the user's reviews`);
    }
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

export const addLike = async (reviewId,userId,gameId) => {
    if (!reviewId || !userId || !gameId) {
        throw new Error("Missing inputs");
    }

    const gamesCollection = await games();

    const game = await gamesCollection.findOne({ game_id: Number(gameId) });
    if (!game) throw new Error(`Game with ID ${gameId} not found.`);


    const reviews = game.reviews;
    if (!reviews || reviews.length === 0) {
        throw new Error('No reviews for this game');
    }

    const reviewIndex = reviews.findIndex(review => review.user_id == reviewId);
    if (reviewIndex === -1) {
        throw new Error(`Review with ID ${reviewId} not found.`);
    }

    const review = reviews[reviewIndex];
    const existingLike = review.likes.find(like => like.user_id == userId);
    if (existingLike) {
        await removeLike(reviewId,userId,gameId);
    }

    const newLike = {
        user_id: userId,
        like: 1 
    };
    review.likes.push(newLike);

    const updateResult = await gamesCollection.updateOne(
        { game_id: Number(gameId), "reviews.user_id": reviewId },
        { $set: { "reviews.$.likes": review.likes } }
    );

    if (updateResult.modifiedCount === 0) {
        throw new Error('Failed to update likes for the review.');
    }
}

export const removeLike = async (reviewId, userId, gameId) => {
    if (!reviewId || !userId || !gameId) {
        throw new Error("Missing inputs");
    }

    const gamesCollection = await games();

    const game = await gamesCollection.findOne({ game_id: Number(gameId) });
    if (!game) throw new Error(`Game with ID ${gameId} not found.`);

    const reviews = game.reviews;
    if (!reviews || reviews.length === 0) {
        throw new Error('No reviews for this game');
    }

    const reviewIndex = reviews.findIndex(review => review.user_id == reviewId);
    if (reviewIndex === -1) {
        throw new Error(`Review with ID ${reviewId} not found.`);
    }

    const review = reviews[reviewIndex];

    const existingLike = review.likes.findIndex(like => like.user_id == userId);
    if (existingLike === -1) {
        throw new Error(`User ${userId} has not already liked this review.`);
    }

    review.likes.splice(existingLike, 1);

    const updateResult = await gamesCollection.updateOne(
        { game_id: Number(gameId), "reviews.user_id": reviewId },
        { $set: { "reviews.$.likes": review.likes } }
    );

    if (updateResult.modifiedCount === 0) {
        throw new Error('Failed to update likes for the review.');
    }
};
