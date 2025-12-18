import jwt from 'jsonwebtoken';
import config from '../utils/config.js';

const decodeToken = (req, res, next) => {

    try {
        const decoded = jwt.verify(req.cookies.token, config.SECRET);
        req.userData = decoded;
    }
     catch (e) {
        console.log(e)
        res.status(405);
     }

    next();
}

export default decodeToken;