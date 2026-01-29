import jwt from "jsonwebtoken"; 

export const protect = (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];

        if(!authHeader) {
            res.status(401);
            throw new Error("No token provided");
        }

        const accessToken = authHeader.split(" ")[1];
        if(!accessToken) {
            res.status(401);
            throw new Error("Token missing");
        }

        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        req.emp = decoded.emp;
        next();
    }
    catch(err) {
        if(!err.status) {
            err.status = 403;
        }
        next(err);
    }
}