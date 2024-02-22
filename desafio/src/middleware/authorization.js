function authorize(roles = []) {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return (req, res, next) => {
        if (req.isAuthenticated() && roles.length && !roles.includes(req.user.role)) {

            return res.status(401).json({ message: 'No está autorizado' });
        }

        next();
    };
}

module.exports = { authorize };