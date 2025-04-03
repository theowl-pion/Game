const userModel = require("../models/usersModel");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { sendWelcomeEmail } = require('../config/emailService');
// Register a new user
const registerUserController = async (req, res) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  
    try {
      const { userName, email, password, googleId, facebookId, phone, address, userType, answer } = req.body;
  
      // ✅ Vérification champs requis
      if (!userName || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'all fields are required',
        });
      }
  
      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 8 characters long and include uppercase, lowercase letters and a digit.",
        });
      }
  
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'email already exists please login',
        });
      }
  
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const user = await userModel.create({
        userName,
        email,
        password: hashedPassword,
        googleId,
        facebookId,
        phone,
        address,
        userType,
        answer,
      });
  
      await sendWelcomeEmail({ userName, email });
      user.password = undefined;
  
      res.status(201).json({
        success: true,
        message: 'user created successfully',
        user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'error in register controller',
        error,
      });
    }
  };
  
  const loginUserController = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'please provide Email OR Password',
        });
      }
  
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User Not Found',
        });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }
  
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      user.password = undefined;
  
      res.status(200).json({
        success: true,
        message: 'login successful',
        token,
        user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'error in login controller',
        error,
      });
    }
  };



// logout user controller
const logoutController = async (req, res) => {
    try {
        await res.clearCookie('token');
        res.status(200).json({
            success: true,
            message: 'logout successfully',
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'error in logout controller',
            error
        });
    }
}
module.exports = { registerUserController, loginUserController, logoutController };
