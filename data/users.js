import { users } from "../config/mongoCollections.js"
import bcrypt from "bcryptjs"
import { ObjectId } from "mongodb";
import {
    validateFirstName,
    validateLastName,
    validateUserId,
    validatePassword
} from "../helpers.js"

const saltRounds = 1;

export const signUpUser = async (
    firstName,
    lastName,
    userId,
    password,
) => {
    firstName = firstName.trim()
    lastName = lastName.trim()
    userId = userId.trim()
    password = password.trim()

    await validateFirstName(firstName);
    await validateLastName(lastName);
    await validateUserId(userId);
    await validatePassword(password);

    userId = userId.toLowerCase();

    const usersCollection = await users();

    const existingUser = await usersCollection.findOne({ userId });
    if (existingUser)
        throw "Error: a user with this userId already exists";

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = {
        firstName,
        lastName,
        userId,
        password: hashedPassword,
        likedGames: [],
        followedUsers: []
    };

    const insertInfo = await usersCollection.insertOne(newUser);
    console.log('Insert result:', insertInfo);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
        throw "Error: Could not add user";

    console.log('Registration completed successfully.');
    return { registrationCompleted: true };
};



export const signInUser = async (
    userId,
    password
) => {
    userId = userId.trim()
    password = password.trim()

    await validateUserId(userId);
    await validatePassword(password);

    const usersCollection = await users();

    const user = await usersCollection.findOne({ userId: userId.toLowerCase() });
    if (!user) throw "Error: either the userId or password is invalid.";

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw "Error: either the userId or password is invalid.";

    return {
        firstName: user.firstName,
        lastName: user.lastName,
        userId: user.userId,
    };
};

export const updateUserProfile = async (userId, updates) => {
    const usersCollection = await users();
    const updatedUser = await usersCollection.findOneAndUpdate(
        { userId: userId.toLowerCase() },
        { $set: updates },
        { returnDocument: 'after' }
    );
    if (!updatedUser.value) throw "Error: User could not be updated.";
    return updatedUser.value;
};

export const deleteUser = async (userId) => {
    const usersCollection = await users();
    const deletedUser = await usersCollection.findOneAndDelete({ userId: userId.toLowerCase() });
    if (!deletedUser.value) throw "Error: User not found or could not be deleted.";
    return deletedUser.value;
};

export async function getUserById(userId) {
    if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
        throw new Error('You must provide a valid userId');
    }

    const userCollection = await users(); // Access the users collection
    const user = await userCollection.findOne({ userId: userId.trim() }); // Query by userId

    if (!user) throw new Error('No user found with the given userId');
    return user;
}

export async function addFavoriteGame(userId, gameId) {
    const userCollection = await users();
    const updateInfo = await userCollection.updateOne(
        { userId: userId.toLowerCase() },
        { $addToSet: { likedGames: gameId } }
    );
    if (updateInfo.modifiedCount === 0) throw new Error('Could not add favorite game');
    return true;
}

export async function removeFavoriteGame(userId, gameId) {
    const userCollection = await users();
    const updateInfo = await userCollection.updateOne(
        { userId: userId.toLowerCase() },
        { $pull: { likedGames: gameId } }
    );
    if (updateInfo.modifiedCount === 0) throw new Error('Could not remove favorite game');
    return true;
}

export async function addFollowedUser(currentUserId, userIdToFollow) {
    const userCollection = await users();

    const updateInfo = await userCollection.updateOne(
        { userId: currentUserId.toLowerCase() },
        { $addToSet: { followedUsers: userIdToFollow } }
    );
    if (updateInfo.modifiedCount === 0) {
        throw new Error('Could not follow the user');
    }
    return true;
}

export async function getFollowedUsers(userId) {
    const userCollection = await users();
    const user = await userCollection.findOne({ userId: userId.toLowerCase() });
    if (!user) throw new Error('User not found');
    return user.followedUsers || [];
}


