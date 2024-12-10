import { signInUser, signUpUser } from '../data/users.js';
import express from 'express';

const router = express.Router();

router
    .route('/signupuser')
    .get(async (req, res) => {
        res.render('signupuser', { title: 'Sign Up' });
    })
    .post(async (req, res) => {
        try {
        const { firstName, lastName, userId, password, favoriteQuote, backgroundColor, fontColor, role } = req.body;
        const themePreference = { backgroundColor, fontColor };
    
        const result = await signUpUser(firstName, lastName, userId, password, favoriteQuote, themePreference, role);
        if (result.registrationCompleted) {
            console.log('User registration successful. Redirecting...');
            return res.redirect('/signinuser');
        }
        throw 'Registration failed.';
        } catch (e) {
        res.status(400).render('signupuser', { title: 'Sign Up', error: e, data: req.body });
        }
});

router
    .route('/signinuser')
    .get(async (req, res) => {
        res.render('signinuser', { title: 'Sign In' });
    })
    .post(async (req, res) => {
        try {
        const { userId, password } = req.body;
        const user = await signInUser(userId, password);
    
        req.session.user = {
            firstName: user.firstName,
            lastName: user.lastName,
            userId: user.userId,
            favoriteQuote: user.favoriteQuote,
            themePreference: user.themePreference,
            role: user.role,
        };
    
        if (user.role === 'admin') {
            return res.redirect('/administrator');
        }
        return res.redirect('/user');
        } catch (e) {
        console.error('Error during sign-in:', e);
        res.status(400).render('signinuser', { 
            title: 'Sign In', 
            error: e, 
            data: req.body });
        }
    });

router.route('/user').get(async (req, res) => {
    const { firstName, lastName, role, favoriteQuote, themePreference } = req.session.user;
    res.render('user', {
        title: 'User Profile',
        firstName,
        lastName,
        role,
        favoriteQuote,
        themePreference,
        currentTime: new Date().toLocaleTimeString(),
        currentDate: new Date().toLocaleDateString(),
    });
});

// router.route('/administrator').get(async (req, res) => {
//     const { firstName, lastName, role, favoriteQuote } = req.session.user;
//     res.render('administrator', {
//         title: 'Admin Dashboard',
//         firstName,
//         lastName,
//         role,
//         favoriteQuote,
//         currentTime: new Date().toLocaleTimeString(),
//         currentDate: new Date().toLocaleDateString(),
//     });
// });

router.route('/signoutuser').get(async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).render('error', { error: 'Failed to log out.' });
        }
        res.redirect('/signinuser');
    });
});

export default router;