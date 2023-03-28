const jwt = require('jsonwebtoken');

const authController = {
    verifyToken: (req, res, next) => {
        const token = req.headers.token;
        if (token) {
            const accessToken = token.split(" ")[1];
            jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
                if (err) {
                    return res.status(403).json({status: 403, 'message': 'Token is invalid!', payload: null});
                }
                req.user = user;
                next();
            });
        } else {
            return res.status(401).json({status: 401, 'message': 'User is not authentication!', payload: null});
        }
    }
}

module.exports = authController;