"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roles = void 0;
const roles = (allowedRoles) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (!allowedRoles.includes(user.role)) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    };
};
exports.roles = roles;
//# sourceMappingURL=role.js.map