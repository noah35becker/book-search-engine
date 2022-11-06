
// IMPORT
const {User} = require('../models');
const {AuthenticationError} = require('apollo-server-express');
const {signToken} = require('../utils/auth');



// RESOLVERS
const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user)
                return await User.findOne({_id: context.user._id})
                    .select('-__v -password')
                    .populate('savedBooks');
            
            throw new AuthenticationError('Not logged in');
        }
    },


    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args)
            const token = signToken(user);

            return {token, user};
        },

        login: async (parent, {email, password}) => {
            const user = await User.findOne({email})
            if (!user)
                throw new AuthenticationError('Incorrect credentials');

            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw)
                throw new AuthenticationError('Incorrect credentials');

            const token = signToken(user);
            
            return {token, user};
        },

        saveBook: async (parent, {input}, context) => {
            if (context.user)
                return await User.findOneAndUpdate(
                    {_id: context.user._id},
                    {$addToSet: {savedBooks: input}},  // `$addToSet` prevents duplicate entries (whereas `$push` does not)
                    {new: true}
                ).select('-__v -password')
                .populate('savedBooks');
            
            throw new AuthenticationError('Not logged in');
        },

        removeBook: async (parent, {bookId}, context) => {
            if (context.user)
                return await User.findOneAndUpdate(
                    {_id: context.user._id},
                    {$pull: {savedBooks: {bookId}}},
                    {new: true}
                ).select('-__v -password')
                .populate('savedBooks');

            throw new AuthenticationError('Not logged in');
        }
    }
}



// EXPORT
module.exports = resolvers;