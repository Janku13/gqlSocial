const Post = require("../../models/Post");
const { UserInputError } = require("apollo-server");
const checkAuth = require("../../util/check-auth");
module.exports = {
  Mutation: {
    createComments: async (_, { postId, body }, context) => {
      const user = checkAuth(context);
      if (body.trim() === "") {
        throw new UserInputError("Empty comment", {
          erros: {
            body: "Comment body must not be empty",
          },
        });
      }
      const post = await Post.findById(postId);
      if (post) {
        post.comments.unshift({
          body,
          username,
          createdAt: new Date().toISOString(),
        });
        await post.save();
        return post;
      } else throw new UserInputError("Post not found  ");
    },
  },
};
