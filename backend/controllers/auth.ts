const login = async (req, res) => {
  const { email, password } = req.body;
//   create User model with AWS SQL DB
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
};

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.create({ email, password });
  res.status(201).json({ message: "User created successfully", user });
};

module.exports = {
  login,
  register,
};
