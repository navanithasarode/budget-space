const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

function sign(user) {
  return jwt.sign({ id: user._id.toString(), email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
}


function safeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    onboarding: user.onboarding || {
      completed: false,
      budgetingWith: "",
      purpose: "",
      firstAction: "",
      numberOfPeople: 1
    }
  };
}


exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "Name, email and password are required" });
    if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });

    const normalized = email.toLowerCase().trim();
    const exists = await User.findOne({ email: normalized });
    if (exists) return res.status(409).json({ message: "An account with that email already exists" });

    const hash = await bcrypt.hash(password, 12);
    const user = await User.create({ name: name.trim(), email: normalized, password: hash });
    res.status(201).json({ token: sign(user), user: safeUser(user) });
  } catch (err) {
    res.status(500).json({ message: "Could not create account" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: String(email || "").toLowerCase().trim() }).select("+password");
    if (!user || !(await bcrypt.compare(password || "", user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    res.json({ token: sign(user), user: safeUser(user) });
  } catch {
    res.status(500).json({ message: "Could not log in" });
  }
};

exports.me = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ user: safeUser(user) });
};


exports.saveOnboarding = async (req, res) => {
  try {
    const {
      budgetingWith,
      purpose,
      firstAction,
      numberOfPeople
    } = req.body;

    const validGroups = [
      "Just me",
      "Family",
      "Friends",
      "Partner",
      "Other"
    ];

    if (!validGroups.includes(budgetingWith)) {
      return res.status(400).json({
        message: "Please select who you are budgeting with"
      });
    }

    if (!purpose || !firstAction) {
      return res.status(400).json({
        message: "Purpose and first action are required"
      });
    }

    const peopleCount = budgetingWith === "Just me"
      ? 1
      : Number(numberOfPeople || 1);

    if (
      !Number.isInteger(peopleCount) ||
      peopleCount < 1 ||
      peopleCount > 100
    ) {
      return res.status(400).json({
        message: "Number of people must be between 1 and 100"
      });
    }

    const User = require("../models/User");
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    user.onboarding = {
      completed: true,
      budgetingWith,
      purpose,
      firstAction,
      numberOfPeople: peopleCount
    };

    await user.save();

    res.json({
      message: "Onboarding saved successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        onboarding: user.onboarding
      }
    });
  } catch (err) {
    console.error("Save onboarding error:", err);
    res.status(500).json({
      message: "Could not save onboarding"
    });
  }
};