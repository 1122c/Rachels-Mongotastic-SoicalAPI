
 const Thought = require("../models/Thought");

 module.exports = {
   // get all thoughts
   async getThoughts(req, res) {
     try {
       const thoughts = await Thought.find().populate("reactions");
       res.json(thoughts);
     } catch (err) {
       console.log(err);
       return res.status(500).json(err);
     }
   },

   // get single thought
   async getSingleThought(req, res) {
     try {
       const thought = await Thought.findOne({
         _id: req.params.thoughtId,
       }).populate("reactions");

       if (!thought) {
         return res.status(400).json({ message: "No thought with that ID" });
       }
       res.json(thought);
     } catch (err) {
       console.log(err);
       return res.status(500).json(err);
     }
   },

   // create new thought
   async createThought(req, res) {
     try {
       const thought = await Thought.create(req.body);
       res.json(thought);
     } catch (err) {
       console.log(err);
       res.status(500).json(err);
     }
   },

   // delete thought + remove thoughts
   async deleteThought(req, res) {
     const thoughtToDelete = await Thought.findOneAndDelete({
       _id: req.params.thoughtId,
     });

     res.json(thoughtToDelete);
     try {
     } catch (err) {
       console.log(err);
       return res.status(500).json(err);
     }
   },
   async updateThought(req, res) {
     const dbThoughtData = await Thought.findOneAndUpdate(
       { _id: req.params.thoughtId },
       { $set: req.body },
       { runValidators: true, new: true }
     );
     if (!dbThoughtData) {
       return res.status(404).json({ message: "No thought with this id!" });
     }
     res.json(dbThoughtData);
     console.log(err);
     res.status(500).json(err);
   },

   async addReaction(req, res) {
     try {
       const dbThoughtData = await Thought.findOneAndUpdate(
         { _id: req.params.thoughtId },
         { $push: { reactions: req.body } },
         { runValidators: true, new: true }
       );
       //req.body
       // {
       //   "reactionText": "yay",
       //   "username": "Robby"
       // }
       if (!dbThoughtData) {
         return res.status(404).json({ message: "No thought with this id!" });
       }
       res.json(dbThoughtData);
     } catch (err) {
       console.log(err);
       res.status(500).json(err);
     }
   },

   async removeReaction(req, res) {
    try {
      const dbThoughtData = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
      );
      if (!dbThoughtData) {
        return res.status(404).json({ message: 'No thought with this id!' });
      }
      res.json(dbThoughtData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
};

 };
