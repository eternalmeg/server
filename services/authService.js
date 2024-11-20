const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('../lib/jwt')
const Device = require("../models/Device");
const SECRET = 'hklhkjhjhjhhkh445hhhkhj';

exports.register = async (userData) => {
    const userExistCheck = await User.findOne({ email: userData.email});
    if (userExistCheck) {
        throw new Error('This email address is already used.');
    }
    const user = await User.create(userData);
    const result = generateToken(user);
    return result;

}

exports.login = async ({ email, password }) => {
    console.log('Received login request for email:', email);
    const user = await User.findOne({ email });
    console.log('Found user:', user);


    if (!user) {
        console.error('User not found');
        throw new Error('Invalid email or password.');
    }
    const isValid = await bcrypt.compare(password, user.password);
    console.log('Password is valid:', isValid);

    if (!isValid) {
        console.error('Invalid password');
        throw new Error('Invalid email or password.');
    }

    const result = await generateToken(user);
    console.log('Generated token result:', result);

    return result;
}
exports.getInfo = async (userId) => {
    const user = await User.findById(userId).populate('createdDevice').populate('preferDevice');
    return user
};

exports.edit =  async (userId, userData) => {
   const user = await User.findByIdAndUpdate(userId, userData, {runValidators: true});
    const payload = {
        _id: user._id,
        email: user.email,
    };
    const token = await jwt.sign(payload, SECRET, { expiresIn: '2h' });
    return {user, token}
}

async function generateToken(user) {

    const payload = {
        _id: user._id,
        email: user.email,
    };
    console.log('Payload for JWT:', payload);
    const token = await jwt.sign(payload, SECRET, {expiresIn: '2h'});

    const result = {
        _id: user._id,
        email: user.email,
        accessToken: token
    };
    return result;

}


