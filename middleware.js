
const logMiddleware = (req, res, next) => {
    const timestamp = new Date().toUTCString();
    const method = req.method;
    const route = req.originalUrl;
    const isAuthenticated = req.session.user ? "Authenticated" : "Non-Authenticated";
    const role = req.session.user?.role || "None";

    console.log(`[${timestamp}]: ${method} ${route} (${isAuthenticated}, Role: ${role})`);
    next();
}

const redirectAuthenticated = (redirectTo) => async (req, res, next) => {
    if (req.session.user) {
        return res.redirect(redirectTo);
    }
    next();
};

const requireAuthentication = (redirectTo) => async (req, res, next) => {
    if (!req.session.user) {
        return res.redirect(redirectTo);
    }
    next();
};

const rewriteUnsupportedBrowserMethods = async (req, res, next) => {
    if (req.body && req.body._method) {
        req.method = req.body._method;
        delete req.body._method;
    }
    next();
};

export {
    logMiddleware,
    redirectAuthenticated,
    requireAuthentication,
    rewriteUnsupportedBrowserMethods,
};
