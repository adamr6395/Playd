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
            const { firstName, lastName, userId, password, role } = req.body;
        
            const result = await signUpUser(firstName, lastName, userId, password, role);
            //console.log('User registration successful. Redirecting...');
            if (result.registrationCompleted) {
                return res.redirect('/');
            } else {
                return res.status(500).render('signupuser', {
                    error: 'Internal Server Error.',
                    data: req.body,
                    title:"Sign Up"
                });
            }
        } catch (e) {
            //console.log("Error passed to template:", e.message);  // Add this log to debug
            res.status(400).render('signupuser', {
                error: e,
                data: req.body,
                title: "Sign Up"
            });
        }
});

router
    .route('/signinuser')
    .get(async (req, res) => {
        res.render('signinuser', { user: req.session.user, title: 'Sign In' });
    })
    .post(async (req, res) => {
        const { userId, password } = req.body;
        try {
            const user = await signInUser(userId, password);
        
            req.session.user = {
                firstName: user.firstName,
                lastName: user.lastName,
                userId: user.userId,
                role: user.role,
            };
        
            // if (user.role === 'admin') {
            //     return res.redirect('/administrator');
            // }
            return res.redirect('/user');
        } catch (e) {
            console.error('Error during sign-in:', e);
            res.status(400).render('signinuser', {
                error: e,
                data: { userId },
                title:"Sign In"
            });
        }
});

router.route('/user').get(async (req, res) => {
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

// router.route('/administrator').get(async (req, res) => {
//     const { firstName, lastName, role } = req.session.user;
//     res.render('administrator', {
//         title: 'Admin Dashboard',
//         firstName,
//         lastName,
//         role,
//         currentTime: new Date().toLocaleTimeString(),
//         currentDate: new Date().toLocaleDateString(),
//     });
// });

router.route('/signoutuser').get(async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).render('error', { error: 'Failed to log out.', title:'error' });
        }
        res.redirect('/r');
    });
});

export default router;