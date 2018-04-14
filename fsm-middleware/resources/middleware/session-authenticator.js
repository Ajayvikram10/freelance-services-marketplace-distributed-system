function authenticationMiddleware () {
    return (req, res, next) => {

        if (req.isAuthenticated()) {
            return next();
        }
        return res.status(401).send(respondAuth("invalidSession"));
    }
}

function respondAuth(responseType) {
    switch (responseType) {
        case "invalidSession":
            return { message: "Session timed out. Please login again!" };
        default:
            return { message: 'There is some issue in server. Please try again later.' };
    }
}

module.exports = {
    authenticationMiddleware
};

