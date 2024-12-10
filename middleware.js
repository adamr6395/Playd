
const logMiddleware = (req, res, next) => {
    const timestamp = new Date().toUTCString();
    const method = req.method;
    const route = req.originalUrl;
    const isAuthenticated = req.session.user ? "Authenticated" : "Non-Authenticated";
    const role = req.session.user?.role || "None";

    console.log(`[${timestamp}]: ${method} ${route} (${isAuthenticated}, Role: ${role})`);
    next();
}

const rootMiddleware = (req, res, next) => {
    if (req.originalUrl === '/') {
        if (req.session.user) {
            if (req.session.user.role === 'admin') {
                return res.redirect('/administrator');
            }
            return res.redirect('/user');
        }
        return res.redirect('/signinuser');
    }
    next();
};

const signinMiddleware = (req, res, next) => {
    if (req.session.user) {
        if (req.session.user.role === 'admin') {
            return res.redirect('/administrator');
        }
        return res.redirect('/user');
    }
    next();
};

const signupMiddleware = (req, res, next) => {
    if (req.session.user) {
        if (req.session.user.role === 'admin') {
            return res.redirect('/administrator');
        }
        return res.redirect('/user');
    }
    next();
}

const userMiddleware = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/signinuser');
    }
    next();
}

const adminMiddleware = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/signinuser');
    }
    if (req.session.user.role !== 'admin') {
        return res.status(403).render('error', {
            error: 'You do not have permission to access this page.',
            link: '/user',
        });
    }
    next();
}

const signoutMiddleware = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/signinuser');
    }
    next();
}

export {
    logMiddleware,
    rootMiddleware,
    signinMiddleware,
    signupMiddleware,
    userMiddleware,
    adminMiddleware,
    signoutMiddleware,
};  