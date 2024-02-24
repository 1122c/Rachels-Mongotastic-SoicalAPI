const { User, Thought } = require("../models");

module.exports = {
  // get all users
  async getUsers(req, res) {
    try {
      const users = await User.find().populate("thoughts").populate("friends");
      res.json(users);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  // get single user
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
        .select("-__v")
        .populate("thoughts")
        .populate("friends");
      if (!user) {
        return res.status(400).json({ message: "No user with that ID" });
      }
      res.json(user);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  // create new user
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // delete user + remove thoughts
  async deleteUser(req, res) {
    try {
      const userToDelete = await User.findOneAndRemove({
        _id: req.params.userId,
      });

      if (!userToDelete) {
        return res.status(404).json({ message: "Aww, no such user exists" });
      }

      // remove thoughts associated with deleted user
      const deletedThoughts = await Thought.deleteMany({
        _id: { $in: userToDelete.thoughts },
      });

      // remove user from other users' friend lists
      await User.updateMany(
        { friends: req.params.userId },
        { $pull: { friends: req.params.userId } }
      );

      // sending a final response including details about the deletion
      res.json({
        message:
          "User successfully deleted with their thoughts and removed from friends lists",
        deletedUser: userToDelete,
        deletedThoughts,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
};
