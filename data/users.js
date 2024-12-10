import { users } from "../config/mongoCollections.js"
import bcrypt from "bcryptjs"
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
    };

    const insertInfo = await usersCollection.insertOne(newUser);
    console.log('Insert result:', insertInfo);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) 
        throw "Error: Could not add user";

    console.log('Registration completed successfully.');
    return {registrationCompleted: true};
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
