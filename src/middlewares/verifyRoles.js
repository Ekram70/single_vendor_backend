const verifyRoles = (allowedRoles) => (req, res, next) => {
    if (!req?.roles) {
        return res.sendStatus(401);
    }

    console.log(req.roles);
    const result = req.roles.map((role) => allowedRoles.includes(role)).find((val) => val === true);

    if (!result) {
        return res.sendStatus(401);
    }
    next();
};

module.exports = verifyRoles;
