const userRoutes = require("./userRoutes");
// const thoughtRoutes = require("./thoughtRoutes");
const router = require("express").Router();

router.use("/users", userRoutes);
// router.user("/thoughts", thoughtRoutes);

module.exports = router;
