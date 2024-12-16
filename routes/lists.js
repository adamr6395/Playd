import express from 'express';
import * as listsData from '../data/lists.js';
import * as gamesData from '../data/games.js';
import * as userData from '../data/users.js';
import { ObjectId } from 'mongodb';
import xss from 'xss';

const router = express.Router();

router.get('/', async (req, res) => {
    
    const { firstName, lastName, role, userId } = req.session.user;
    console.log("HEY!");
    console.log(`Fetching used: ${userId}`); // Debug log
    const user = await userData.getUserById(userId);

    //console.log("My name is ",user);
    //const userId = req.session.user._id;
    try {
        if (!req.session.user) {
            return res.status(401).render('error', {
                isServerError: true,
                title: 'Error',
                errorMessage: 'You must be logged in to view game lists.',
            });
        }

        
        const { firstName, lastName, role, userId } = req.session.user;
        //console.log(req.session.user)
        //const userId = req.session.user.userId;  
        const user = await userData.getUserById(userId); 
        const userLists = await listsData.getListsByUser(userId);

        console.log(userLists); 

        res.render('gamelist', {
            title: `${user.firstName}'s Game Lists`,
            user: req.session.user,
            userLists: userLists,
        });
    } catch (e) {
        console.error('Error fetching game lists:', e.message);
        res.status(400).render('error', {
            isServerError: true,
            title: 'Error',
            errorMessage: 'Unable to fetch game lists.',
        });
    }
});

router.get('/create', (req, res) => {
    res.render('createlist', {
        title: 'Create a New Game List',
        user: req.session.user,
    });
});

router.post('/create', async (req, res) => {
    const { name, description } = req.body;
    const { firstName, lastName, role, userId } = req.session.user;
    //const userId = req.session.user.userId;
    console.log("EEEEEEEEE");
    console.log(userId);

    try {
        console.log("J");
        const newList = await listsData.createList(name, description, userId);
        res.redirect('/gamelist');  
    } catch (e) {
        res.status(400).render('error', {
            isServerError: true,
            title: 'Error',
            errorMessage: e.message,
        });
    }
});

router.get('/:id', async (req, res) => {
    console.log(req.params);
    const listId = req.params.id;
    try {
        const list = await listsData.getListById(listId);
        const allGames = await gamesData.getAllGames(); 

        res.render('listDetails', {
            title: `List: ${list.name}`,
            user: req.session.user,
            list: list,
            allGames: allGames,
        });
    } catch (e) {
        res.status(400).render('error', {
            isServerError: true,
            title: 'Error',
            errorMessage: 'Unable to fetch list details.',
        });
    }
});

router.post('/:listId/addGame', async (req, res) => {
    const listId = req.params.listId;
    const gameId = req.body.gameId;

    try {
        if (!ObjectId.isValid(gameId)) {
            return res.status(400).render('error', {
                isServerError: true,
                title: 'Error',
                errorMessage: 'Invalid Game ID provided.',
            });
        }
        await listsData.addGameToList(listId, gameId);
        res.redirect(`/gamelist/${listId}`);  
    } catch (e) {
        console.log('Error adding game to list:', e.message);
        res.status(400).render('error', {
            isServerError: true,
            title: 'Error',
            errorMessage: 'Unable to add the game to the list.',
        });
    }
});

router.post('/:listId/share', async (req, res) => {
    const listId = xss(req.params.listId);
    const sharedStatus = xss(req.body.sharedStatus || 'private');
    const sharedWith = xss(req.body.sharedWith || '');

    try {
        if (!ObjectId.isValid(listId)) throw new Error('Invalid list ID.');
        if (!['private', 'public'].includes(sharedStatus))
            throw new Error('Shared status must be either "private" or "public".');

        const sharedWithArray = sharedWith
            ? sharedWith.split(',').map((id) => id.trim()).filter((id) => id !== '')
            : [];
        
        await listsData.shareList(listId, sharedStatus, sharedWithArray);
        res.redirect(`/lists/${listId}`);
    } catch (e) {
        res.status(400).render('error', {
            isServerError: true,
            title: 'Error',
            errorMessage: e.message || 'An unexpected error occurred.'
        });
    }
});

export default router;
