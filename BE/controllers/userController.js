const User = require("../models/User");

let getAllUser = async (req, res) => {
  try {
    let user = await User.find({});
    res.status(200).json({
      ErrCode: 0,
      user,
    });
  } catch (error) {
    console.log("Error", error);
    res.status(500).json(error);
  }
};

let deleteUser = async (req, res) => {
  try {
    let user = await User.deleteOne({ _id: req.params.id });
    res.status(201).json({
      ErrCode: 0,
      user,
    });
  } catch (error) {
    console.log("Error", error);
    res.status(500).json(error);
  }
};
module.exports = { getAllUser, deleteUser };
