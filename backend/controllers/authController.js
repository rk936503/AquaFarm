import User from '../models/User.js';
import { generateToken } from '../utils/tokenUtils.js';
import { HTTP_STATUS, ERROR_MESSAGES, ROLES } from '../config/constants.js';

export const signup = async (req, res, next) => {
  try {
    const { name, email, password, phone, location, role } = req.body;

    // Validation
    if (!name || !email || !password || !phone || !location) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(HTTP_STATUS.CONFLICT).json({
        success: false,
        message: ERROR_MESSAGES.USER_EXISTS,
      });
    }

    // Create user
    user = await User.create({
      name,
      email,
      password,
      phone,
      location,
      role: role || ROLES.FARMER,
    });

    // Generate token
    const token = generateToken(user._id, user.role);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'User created successfully',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        location: user.location,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Find user with password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: ERROR_MESSAGES.INVALID_CREDENTIALS,
      });
    }

    // Check password
    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: ERROR_MESSAGES.INVALID_CREDENTIALS,
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: 'Your account has been deactivated',
      });
    }

    // Generate token
    const token = generateToken(user._id, user.role);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Login successful',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        location: user.location,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

export default { signup, login };
