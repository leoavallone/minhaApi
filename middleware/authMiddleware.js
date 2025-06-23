const jwt = require('jsonwebtoken');

// função para verificar, usar quando a função necessitar de autenticação e token
function verifyToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Access denied' });
    try {
        const decoded = jwt.verify(token, 'ava@2020');
        req.id = decoded.id;
        req.email = decoded.email;
        req.name = decoded.name;
        req.age = decoded.age;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token'+ error });
    }
}

module.exports = verifyToken;