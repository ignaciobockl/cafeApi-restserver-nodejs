const { response, request } = require("express")


const isAdminRole = (req = request, res = response, next) => {

    if (!req.user) {
        res.status(500).json({
            ok: false,
            msg: 'You want to validate the role without verifying the token first.'
        });
    }

    const { name, role } = req.user;

    if (role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            msg: `The user ${ name } is not an administrator.`
        });
    }

    next();

}

const hasRole = (...roles) => {

    return (req = request, res = response, next) => {

        if (!req.user) {
            res.status(500).json({
                ok: false,
                msg: 'You want to validate the role without verifying the token first.'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(401).json({
                ok: false,
                msg: `The service requires one of these roles: ${ roles }.`
            });
        }

        next();

    }

}


module.exports = {
    isAdminRole,
    hasRole
}