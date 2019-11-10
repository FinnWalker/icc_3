const userModel = require("../models/users");
const sanitize = require("mongo-sanitize");

module.exports = {
  create: function(req, res, next) {
    const first_name = sanitize(req.body.first_name);
    const email = sanitize(req.body.email);
    const postcode = sanitize(req.body.postcode);
    const marketing = sanitize(req.body.marketing);

    if (first_name && email) {
      userModel.create({ first_name, email, postcode, marketing }, function(err, result) {
        if (err) {
          next(err);
        } else {
          res.json({ message: "Account created" });
        }
      });
    } else {
      console.log(req.body)
      res.status(400).json({ message: "Please include a name and email" });
    }
  }
};
