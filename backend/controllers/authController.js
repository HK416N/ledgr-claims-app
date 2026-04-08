const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const saltRounds = 10;

// export routes to authRoutes

// SIGNUP
exports.signup = async (req, res) => {
  try {
    const userInDatabase = await User.findOne({ email: req.body.email });
    
    if (userInDatabase) {
      return res.status(409).json({
        success: false,
        error: 'Email already taken.',
        code: 'EMAIL_TAKEN'
      });
    }

    const user = await User.create({
      name: req.body.name,
      email: req.body.email, //lower case handled by model
      hashedPassword: bcrypt.hashSync(req.body.password, saltRounds)
    });

    const payload = { 
      _id: user._id, 
      name: user.name,
      email: user.email,
    };

    const token = jwt.sign( payload , process.env.JWT_SECRET); //add { expiresIn: '30d'}

    res.status(201).json({
      success: true,
      data:{
        token,
        user: payload,
      }
  });
  
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: err.message, 
      code: 'SERVER_ERROR',
    });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid email or password.', 
        code: 'INVALID_CREDENTIALS'
      });
    }

    const isPasswordCorrect = bcrypt.compareSync(
      req.body.password, user.hashedPassword
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid email or password.', 
        code: 'INVALID_CREDENTIALS'
      });
    }

    //valid users - generate token
    const payload = { 
      _id: user._id, 
      name: user.name,
      email: user.email, 
    };

    const token = jwt.sign( payload , process.env.JWT_SECRET); //add { expiresIn: '30d'}

    res.status(200).json({ 
      success: true,
      data: {
        token,
        user: payload, 
      }  
    });
  } catch (err) {
    res.status(500).json({
      success: false, 
      error: err.message,
      code: 'SERVER_ERROR',
    });
  }
};
