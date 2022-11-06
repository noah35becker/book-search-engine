
// IMPORT
const jwt = require('jsonwebtoken');
require('dot-env');

// set token secret and expiration date
const secret = process.env.JWT_SECRET || 'test secret phrase';
const expiration = '2h';

module.exports = {
    authMiddleware: function ({req}) {
        let token = req.query.token || req.headers.authorization;  // allows token to be sent via req.query or headers

        if (req.headers.authorization)  // In the HTTP header, shave off the word 'Bearer' at the beginning of the value
            token = token.split(' ').pop().trim();

        if (!token)
            return req;

        try{
            const {data} = jwt.verify(token, secret, {maxAge: expiration});
            req.user = data;
        }catch{
            console.error('Invalid token');
        }

        return req;
    },

    signToken: function ({username, email, _id}){
        const payload = {username, email, _id};

        return jwt.sign(
            {data: payload},
            secret,
            {expiresIn: expiration}
        );
    },
};
