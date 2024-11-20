

const mongoose = require('mongoose');
const Device = require('../models/Device');
const User = require('../models/User');

exports.getLastDevices = () => Device.find().sort({createdAt: -1}).limit(6);

exports.getAll =() => Device.find();

exports.create = async (userId, deviceData) => {

    const createdDevice = await Device.create({
        owner: userId,
        ...deviceData
    });

//update in User collection about created courses with the id of the new created course

    await User.findByIdAndUpdate(userId, {$push: {createdDevice: createdDevice._id}});

    return createdDevice;

};

exports.getOne = (deviceId) => Device.findById(deviceId);

exports.getOneWithDetails = (deviceId) => this.getOne(deviceId).populate('owner').populate('preferredList');

exports.prefer = async (deviceId, userId) => {
    await Device.findByIdAndUpdate(deviceId, { $push: {preferredList: userId }}, {runValidators: true});
    await User.findByIdAndUpdate(userId, { $push: { preferDevice: deviceId}}, {runValidators: true});

};

exports.delete = (deviceId) => Device.findByIdAndDelete(deviceId);

exports.edit = (deviceId, deviceData) => Device.findByIdAndUpdate(deviceId, deviceData, {runValidators: true})

exports.deleteMultiple = (deviceIds) => {
    return Device.deleteMany({ _id: { $in: deviceIds } });
};