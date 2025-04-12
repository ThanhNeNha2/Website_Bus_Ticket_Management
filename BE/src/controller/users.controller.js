import USER from "../models/User.model";

//  CREATE USER

export const createUser = async (req, res) => {
  const user = await USER.create(req.body);
  return res.status(200).json({
    message: "OK",
    user,
  });
};

export const getUser = (req, res) => {
  console.log();

  res.send("hahahha");
};

export const updateUser = (req, res) => {
  console.log();

  res.send("hahahha");
};

export const deleteUser = (req, res) => {
  console.log();

  res.send("hahahha");
};
