import { lists } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';

const validateObjectId = (id) => {
    if (!id || typeof id !== 'string' || id.trim() === '') throw 'Invalid ID provided.';
    if (!ObjectId.isValid(id)) throw 'Invalid ObjectId format.';
    return id.trim();
};

export const createList = async (name, description, userId, sharedStatus = 'private', sharedWith = []) => {
    if (!name || typeof name !== 'string' || name.trim() === '') throw 'List name must be a non-empty string.';
    if (description && typeof description !== 'string') throw 'Description must be a string.';
    if (!userId || typeof userId !== 'string' || userId.trim() === '') throw 'Valid userId must be provided.';
    if (!['private', 'public'].includes(sharedStatus)) throw 'Shared status must be either "private" or "public".';
    if (!Array.isArray(sharedWith)) throw 'Shared with must be an array of user IDs.';
    sharedWith.forEach((id) => validateObjectId(id)); 

    const listsCollection = await lists();
    const newList = {
        name: name.trim(),
        description: description?.trim() || '',
        createdBy: userId.trim(),
        games: [],
        sharedStatus: sharedStatus,
        sharedWith: sharedWith
    };
-
    console.log("HEY");
    const insertInfo = await listsCollection.insertOne(newList);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Could not create the list.';
    return { ...newList, _id: insertInfo.insertedId.toString() };
};

export const addGameToList = async (listId, gameId) => {
    validateObjectId(listId);

    const listsCollection = await lists();
    const updatedList = await listsCollection.updateOne(
        { _id: new ObjectId(listId) },
        { $addToSet: { games: gameId } }
    );

    if (updatedList.modifiedCount === 0) throw 'Could not add game to the list.';
};

export const removeGameFromList = async (listId, gameId) => {
    validateObjectId(listId);
    validateObjectId(gameId);

    const listsCollection = await lists();
    const updatedList = await listsCollection.updateOne(
        { _id: new ObjectId(listId) },
        { $pull: { games: gameId } }
    );

    if (updatedList.modifiedCount === 0) throw 'Could not remove game from the list.';
};

export const shareList = async (listId, sharedStatus, sharedWith = []) => {
    validateObjectId(listId);
    if (!['private', 'public'].includes(sharedStatus)) throw 'Shared status must be either "private" or "public".';
    if (!Array.isArray(sharedWith)) throw 'Shared with must be an array of user IDs.';
    sharedWith.forEach((id) => validateObjectId(id)); 

    const listsCollection = await lists();
    const updatedList = await listsCollection.updateOne(
        { _id: new ObjectId(listId) },
        { $set: { sharedStatus, sharedWith } }
    );

    if (updatedList.modifiedCount === 0) throw 'Could not update sharing status.';
};
export const getListsByUser = async (userId) => {
    if (!userId || typeof userId !== 'string' || userId.trim() === '')
        throw new Error('User ID must be a non-empty string.');
    
    userId = userId.trim();
    //console.log("Y!");
    const listCol = await lists();
    //console.log("X!");
    const userLists = await listCol.find({ createdBy: userId }).toArray();
    //console.log("Z");
    if (!userLists) 
        throw new Error('No lists found for the user.');

    return userLists;
};
export const getListById = async (listId) => {
    if (!listId || typeof listId !== 'string' || listId.trim() === '') {
        throw new Error('Invalid List ID provided.');
    }
    listId = listId.trim();

    if (!ObjectId.isValid(listId)) {
        throw new Error('Invalid ObjectId format for List ID.');
    }

    const listsCollection = await lists();

    const list = await listsCollection.findOne({ _id: new ObjectId(listId) });

    if (!list) {
        throw new Error('List not found.');
    }

    return list;
};