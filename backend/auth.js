import jwt from "jsonwebtoken";
const config = process.env;

const verifyToken = (req, res, next) => {
  console.log(req.body);
  const token = req.body.token;
  console.log(req.body.token);
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
    console.log(req.user);
    console.log("verified");
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};
const auth = verifyToken;
export { auth };
