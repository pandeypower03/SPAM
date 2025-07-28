
const jwt = require('jsonwebtoken');
const { generateToken, requireAuth } = require("../config/auth.js");
const { User, Contact } = require('../models/models');  
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config();


// In-memory OTP storage
const otpStore = new Map();

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


const sendotp = async (req, res) => {
  try {
    const { email } = req.body;
   
    console.log("Send OTP request body:", req.body);
    const otp = Math.floor(100000 + Math.random() * 900000);
     // Store OTP in memory
    otpStore.set(email, {
      otp: otp,
      timestamp: Date.now(),
    });
     console.log(otpStore);
      const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Email Verification - OTP Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Email Verification</h2>
          <p>Dear User,</p>
          <p>Your OTP for email verification is:</p>
          <div style="background-color: #f0f0f0; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #007bff; font-size: 32px; margin: 0;">${otp}</h1>
          </div>
          <p>This OTP will expire in <strong>60 seconds</strong>.</p>
          <p>If you didn't request this verification, please ignore this email.</p>
          <hr style="margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">This is an automated email, please do not reply.</p>
        </div>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    console.log(`OTP sent to ${email}: ${otp}`); 

    return res.status(200).json({ 
      message: 'OTP sent successfully to your email',
      expiresIn: '10 minutes'
    });

  } catch (error) {
    console.error('Error sending OTP:', error);
    return res.status(500).json({ message: 'Failed to send OTP' });
  }
};

const verifyotp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const storedOtpData = otpStore.get(email);
    if (!storedOtpData) {
      return res.status(400).json({ message: "OTP not found" });
    }

    const isExpired = Date.now() - storedOtpData.timestamp > 60 * 1000;
    if (isExpired) {
      otpStore.delete(email);
      return res.status(400).json({ message: "OTP expired" });
    }

    if (storedOtpData.otp !== parseInt(otp)) {
      return res.status(400).json({
        message: "Invalid OTP. Please try again.",
      });
    }

    // Move token generation outside else block
    console.log("generating token");
    const user = await User.findOne({ where: { email } });
    const payload = { id: user.id };
    const token = generateToken(payload);
    console.log("Token generated:", token);

    return res.status(200).json({
      message: "email verified successfully",
      token: token,
    });
  } catch (error) {
    console.error("failed to verify OTP:", error);
    return res.status(500).json({ message: "Failed to verify OTP" });
  }
};


// Signup
const signup = async (req, res) => {
  try {
    const { username, PHnumber, email, password, city, country } = req.body;
    console.log("BODY →", req.body);

    // Validate required fields
    if (!username || !PHnumber || !email || !password || !city || !country) {
      return res.status(400).json({
        message: "Missing required fields",
        errors: {
          ...(!username && { username: "Username is required" }),
          ...(!PHnumber && { PHnumber: "Phone number is required" }),
          ...(!email && { email: "Email is required" }),
          ...(!password && { password: "Password is required" }),
          ...(!city && { city: "City is required" }),
          ...(!country && { country: "Country is required" }),
        },
      });
    }

    // Check if username, email, or phone number already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }, { PHnumber }],
      },
    });

    if (existingUser) {
      // Determine which field is duplicated
      const errors = {};
      if (existingUser.username === username)
        errors.username = "Username already taken";
      if (existingUser.email === email)
        errors.email = "Email already registered";
      if (existingUser.PHnumber === PHnumber)
        errors.PHnumber = "Phone number already registered";
      return res.status(409).json({ errors });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user (not verified initially)
    const user = await User.create({
      username,
      PHnumber,
      email,
      password: hashedPassword,
      city,
      country,
      isVerified: false,
    });

    console.log("User created:", user.get({ plain: true }));

    // Return success response
    return res.status(201).json({
      message: "Signup successful. Please check your email for verification.",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        PHnumber: user.PHnumber,
        city: user.city,
        country: user.country,
        isVerified: false,
      }
    });
  } catch (error) {
    console.error("Error in signup:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Email:", req.body.email);
    console.log("Password:", req.body.password);

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Missing required fields",
        errors: {
          ...(!email && { email: "Email is required" }),
          ...(!password && { password: "Password is required" }),
        },
      });
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({
        message: "Authentication failed",
        errors: { email: "No user found with this email" },
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Authentication failed",
        errors: { password: "Invalid password" },
      });
    }

    // Return success response (matching signup structure)
    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        PHnumber: user.PHnumber,
        city: user.city,
        country: user.country,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Error in login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const addcontact = async(req, res) => {
  try {
    const { name, phonenumber } = req.body;
    console.log(req.body)
        console.log(req.user);
    const userId = req.user.user_id; // From auth middleware

    // Validation
    if (!name || !phonenumber) {
      return res.status(400).json({
        success: false,
        message: "Name and phone number are required",
      });
    }

    // Create contact
    const contact = await Contact.create({
      user_id: userId,
      contact_name: name.trim(),
      contact_phone: phonenumber.trim(),
    });

    res.status(201).json({
      success: true,
      message: "Contact added successfully",
      contact: {
        id: contact.id,
        name: contact.contact_name,
        phone: contact.contact_phone,
      },
    });
  } catch (error) {
    console.error("Add contact error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add contact",
    });
  }
}


const deletecontact = async (req, res) => {
  try {
    const { contactId } = req.params; // or req.body, depending on your route setup
    const userId = req.user.user_id; // Extract the actual user ID

    // Find the contact and ensure it belongs to the authenticated user
    const contact = await Contact.findOne({
      where: {
        id: contactId,
        user_id: userId,
      },
    });

    if (!contact) {
      return res.status(404).json({
        error: "Contact not found or you don't have permission to delete it",
      });
    }

    // Delete the contact
    await contact.destroy();

    res.status(200).json({
      message: "Contact deleted successfully",
      deletedContact: {
        id: contact.id,
        contact_name: contact.contact_name,
        contact_phone: contact.contact_phone,
      },
    });
  } catch (error) {
    console.log("Delete contact error:", error);
    res.status(500).json({ error: "Failed to delete contact" });
  }
};


const getcontacts = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const contacts = await Contact.findAll({
      where: { user_id: userId },
      order: [["created_at", "DESC"]],
    });

    res.status(200).json(contacts);
  } catch (error) {
    console.log("Get contacts error:", error);
    res.status(500).json({ error: "Failed to get contacts" });
  }
};


// Test protected route
const asehi = (req, res) => {
  try {
    console.log('asehi called');
    res.status(200).json({ message: 'asehi endpoint' });
  } catch (error) {
    console.error('Error in asehi:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  signup,
  login,
  asehi,
  sendotp,
  verifyotp,
  addcontact,
  deletecontact,
  getcontacts,
};



// const jwt = require('jsonwebtoken');
// const {generateToken}  = require('../config/auth.js');
// const {Person} = require('../models/models');

// const JWT_SECRET    = process.env.JWT_SECRET;
// const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';


// const signup =async(req, res) => {
//     try{
//       const data = req.body;
//       const newPerson = new Person(data);
//       const response = await newPerson.save();
//       console.log('User created:', response);
//       const token = generateToken(response.username);
//       console.log('Token generated:', token);
//       res.status(201).json({response:response, token: token});    
//   }
//     catch(error){
//       console.error('Error in signup:', error);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   };


// const login = async(req, res) => {
//   try {
//     const { username, password} = req.body;
//     const user = await Person.findOne({ where: { username, password } });
//     if (!user || user.password !== password) {
//       return res.status(401).json({ message: 'Invalid username or password' });
//     }
//     const payload = {
//       username: user.username,
//       id: user.id
//     };
//     const token = generateToken(payload);
//     console.log('Token generated:', token);
   
// } 
// catch (error) {
//     console.error('Error in login:', error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// };


// const asehi=(req,res)=>{
//     try{
//         console.log('asehi called');
//         res.status(200).json({message: 'asehi endpoint'});
//     }catch(error){
//         console.error('Error in asehi:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// }

// module.exports = {signup , login ,asehi};