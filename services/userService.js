const mongoose = require('mongoose');
const Device = require('../models/Device');
const User = require('../models/User');

exports.getInfo = (userId) => User.findById(userId).populate('createdDevice').populate('preferDevice');