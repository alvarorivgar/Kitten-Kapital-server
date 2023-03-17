const { expressjwt } = require("express-jwt");

const isAuthenticated = expressjwt({
  secret: process.env.TOKEN_SECRET,
  algorithms: ["HS256"],
  requestProperty: "payload",
  getToken: (req) => {
    if (!req.headers || !req.headers.authorization) {
      return null;
    }
    const tokenArr = req.headers.authorization.split(" ");
    const tokenType = tokenArr[0];
    const token = tokenArr[1];

    if (tokenType !== "Bearer") {
      return null;
    }

    return token;
  },
});

const isUser = (req, res, next) => {
  req.payload.role === "user"
    ? next()
    : res.status(401).json({ message: "no e suser" });
};

const isKitty = (req, res, next) => {
  req.payload.role === "kitty"
    ? next()
    : res.status(401).json({ message: "no es kitty" });
};

const isAdmin = (req, res, next) => {
  req.payload.role === "admin"
    ? next()
    : res.status(401).json({ message: "no es admin" });
};

const isUserOrKitty = (req, res, next) => {
  req.payload.role === "user" || req.payload.role === "kitty"
    ? next()
    : res.status(401).json();
};

module.exports = {
  isAuthenticated,
  isUser,
  isKitty,
  isUserOrKitty,
  isAdmin,
};
