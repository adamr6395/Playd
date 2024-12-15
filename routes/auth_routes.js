import { signInUser, signUpUser, getUserById, addFollowedUser } from '../data/users.js';
import { getGameById } from '../data/games.js';
import express from 'express';
import { redirectAuthenticated, requireAuthentication } from '../middleware.js';

const router = express.Router();


router
    .route('/signupuser')
    .get(redirectAuthenticated('/user'), async (req, res) => {
        res.render('signupuser', { user: req.session.user, title: 'Sign Up' });
    })
    .post(async (req, res) => {
        try {
            const { firstName, lastName, userId, password, role } = req.body;
            const result = await signUpUser(firstName, lastName, userId, password, role);

            if (result.registrationCompleted) {
                return res.redirect('/');
            } else {
                res.status(500).render('signupuser', {
                    error: 'Internal Server Error.',
                    data: req.body,
                    title: 'Sign Up',
                    user: req.session.user
                });
            }
        } catch (e) {
            res.status(400).render('signupuser', {
                error: e,
                data: req.body,
                title: 'Sign Up',
            });
        }
    });

router
    .route('/signinuser')
    .get(redirectAuthenticated('/user'), async (req, res) => {
        res.render('signinuser', { user: req.session.user, title: 'Sign In' });
    })
    .post(async (req, res) => {
        try {
            const { userId, password } = req.body;
            const user = await signInUser(userId, password);

            req.session.user = {
                firstName: user.firstName,
                lastName: user.lastName,
                userId: user.userId,
                role: user.role,
            };
            res.redirect('/user');
        } catch (e) {
            res.status(400).render('signinuser', {
                error: e,
                data: { userId },
                title: 'Sign In',
            });
        }
    });

router.route('/user').get(requireAuthentication('/signinuser'), async (req, res) => {
    const { firstName, lastName, role, userId } = req.session.user;
    
    try {
        console.log(`Fetching user: ${userId}`); // Debug log
        const user = await getUserById(userId);
        console.log('User data:', user); // Debug log

        const likedGames = user.likedGames
            ? await Promise.all(user.likedGames.map(async (gameId) => {
                try {
                    return await getGameById(gameId);
                } catch (e) {
                    console.warn(`Skipping invalid game ID: ${gameId}`);
                    return null;
                }
            })).then(games => games.filter(game => game)) // Remove nulls
            : [];

        
        const followedUsers = user.followedUsers || [];

        console.log('Liked games:', likedGames); // Debug log

        res.render('user', {
            user: req.session.user,
            title: 'User Profile',
            firstName,
            lastName,
            role,
            currentTime: new Date().toLocaleTimeString(),
            currentDate: new Date().toLocaleDateString(),
            likedGames,
            followedUsers,
        });
    } catch (e) {
        console.error('Error in /user route:', e.message);
        res.status(500).render('error', {
            isServerError: true,
            title: 'Error',
            errorMessage: 'Unable to load user profile',
        });
    }
});

router.route('/signoutuser').get(requireAuthentication('/signinuser'), async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).render('error', { error: 'Failed to log out.', title: 'Error' });
        }
        res.redirect('/');
    });
});

router.post('/follow', async (req, res) => {
    const { userIdToFollow } = req.body;
    const currentUserId = req.session.user.userId;

    try {
        if (!userIdToFollow || typeof userIdToFollow !== 'string') {
            throw new Error('Invalid User ID provided');
        }
        if (currentUserId === userIdToFollow) {
            throw new Error('You cannot follow yourself');
        }

        const userToFollow = await getUserById(userIdToFollow); // Ensure the user exists
        if (!userToFollow) {
            throw new Error('User not found');
        }

        await addFollowedUser(currentUserId, userIdToFollow);

        res.redirect('/user'); // Redirect back to the user profile
    } catch (e) {
        console.error('Error in /follow route:', e.message);
        res.status(500).render('error', { error: e.message, title: 'Follow Error' });
    }
});

router.get('/profile/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const user = await getUserById(userId);

        // Fetch detailed game info for liked games
        const likedGames = user.likedGames
            ? await Promise.all(user.likedGames.map(async (gameId) => {
                try {
                    return await getGameById(gameId);
                } catch (e) {
                    console.warn(`Skipping invalid game ID: ${gameId}`);
                    return null;
                }
            })).then(games => games.filter(game => game)) // Remove nulls
            : [];


        res.render('profile', {
            title: `${user.firstName} ${user.lastName}'s Profile`,
            user: { ...user, likedGames }, // Attach enriched likedGames
        });
    } catch (e) {
        console.error('Error in /profile/:userId route:', e.message);
        res.status(404).render('error', {
            title: 'User Not Found',
            error: e.message,
        });
    }
});


export default router;
