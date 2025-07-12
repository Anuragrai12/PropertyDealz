// middleware/role.js

function landOwnerOnly(req, res, next) {
  if (req.user?.role !== 'landOwner') {
    return res.status(403).send('Access denied: Landowners only');
  }
  next();
}

function userOnly(req, res, next) {
  if (req.user?.role !== 'user') {
    return res.status(403).send('Access denied: Users only');
  }
  next();
}

module.exports = { landOwnerOnly, userOnly };
