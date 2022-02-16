const postsResolvers = require("./resolvers/posts.resolvers");
const usersResolvers = require("./resolvers/users.resolvers");
const commentsResolvers = require('./resolvers/comments')
module.exports = {
  Query: {
    ...postsResolvers.Query,
  },
  Mutation:{
    ...usersResolvers.Mutation,
    ...postsResolvers.Mutation,
    ...commentsResolvers.Mutation
  }
};
