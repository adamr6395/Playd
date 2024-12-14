import { signInUser, signUpUser } from '../data/users.js';
import express from 'express';
import { redirectAuthenticated, requireAuthentication } from '../middleware.js';

const router = express.Router();


router
    .route('/signupuser')
    .get(redirectAuthenticated('/user'), (req, res) => {
        res.render('signupuser', { title: 'Sign Up' });
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
    .get(redirectAuthenticated('/user'), (req, res) => {
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

router.route('/user').get(requireAuthentication('/signinuser'), (req, res) => {
    const { firstName, lastName, role } = req.session.user;
    res.render('user', {
        title: 'User Profile',
        firstName,
        lastName,
        role,
        currentTime: new Date().toLocaleTimeString(),
        currentDate: new Date().toLocaleDateString(),
    });
});

router.route('/signoutuser').get(requireAuthentication('/signinuser'), (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).render('error', { error: 'Failed to log out.', title: 'Error' });
        }
        res.redirect('/');
    });
});

export default router;
