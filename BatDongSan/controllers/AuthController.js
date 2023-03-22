const jwt = require('jsonwebtoken');

const authController = {
    verifyToken: (req, res, next) => {
        const token = req.headers.token;
        if (token) {
            const accessToken = token.split(" ")[1];
            jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
                if (err) {
                    return res.status(403).json('Token is invalid!');
                }
                req.user = user;
                next();
            });
        } else {
            return res.status(401).json('User is not authentication!');
        }
    }
}

module.exports = authController;