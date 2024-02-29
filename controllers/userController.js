const User = require("../models/User");
const Thought = require("../models/Thought");

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
    const userToDelete = await User.findOne({ _id: req.params.userId });
    try {
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }

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
    try {
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

  async updateUser(req, res) {
    try {
      const dbUserData = await User.findOneAndUpdate(
        { _id: req.params.userId },
        {
          $set: req.body,
        },
        {
          new: true,
        }
      );
      res.json(dbUserData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // Add a friend to the user's friend list
  async addFriend(req, res) {
    try {
      const userId = req.params.userId;
      const friendId = req.params.friendId;

      // Check if friendId is trying to add itself
      if (userId === friendId) {
        return res
          .status(400)
          .json({ message: "Users cannot add themselves as a friend." });
      }

      // Find user and add friendId to friends list
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { friends: friendId } }, // Use $addToSet to prevent duplicates
        { new: true, runValidators: true } // Return the updated user and run schema validators
      ).populate("friends"); // Optionally populate the friends array to return updated data

      if (!updatedUser) {
        return res.status(404).json({ message: "No user found with this ID" });
      }

      res.json(updatedUser);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  async removeFriend(req, res) {
    try {
      const dbUserData = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { new: true }
      );
      if (!dbUserData) {
        return res.status(404).json({ message: "No user with this id!" });
      }
      res.json(dbUserData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
};
