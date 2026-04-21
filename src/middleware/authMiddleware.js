const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

function authenticateToken(req, res, next) {
    if (!JWT_SECRET) {
        return res.status(500).json({ success: false, message: 'JWT_SECRET nao configurado.' });
    }

    const authorizationHeader = req.headers.authorization;
    let token = null;
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
        token = authorizationHeader.slice(7);
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Token em falta.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        return next();
    } catch {
        return res.status(401).json({ success: false, message: 'Token invalido ou expirado.' });
    }
}

module.exports = { authenticateToken };
