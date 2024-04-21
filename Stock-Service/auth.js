const jwt = require("jsonwebtoken");

module.exports = function checkAuth(req, res, next) {
    const token = req.headers['authorization'];
    if (token) {
        const extractedToken = token.split(' ')[1];
        const decodedToken = jwt.verify(extractedToken, 'secretKey');
        req.decodedToken = decodedToken;
        next();
    } else {
        return res.status(401).json({error: "Token not found"})
    };

}