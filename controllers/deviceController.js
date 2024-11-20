const router = require('express').Router();
const {isAuth} = require("../middlewares/authMiddleWare");
const deviceService = require('../services/deviceService');
const authService = require('../services/authService')

router.get('/latest', async (req, res) => {

    try {
        const devices = await deviceService.getLastDevices().lean();
        res.json(devices)
    } catch (err) {
        res.status(400).json({message: err.message})
    }

});
router.get('/catalog', async (req, res) => {

    try {
        const devices = await deviceService.getAll().lean();
        res.json(devices)
    } catch (err) {
        res.status(400).json({message: err.message})
    }

});


router.post('/create', isAuth, async (req, res) => {
    const deviceData = req.body;

    try {
        await deviceService.create(req.user._id, deviceData);
        res.status(200).end();
    } catch (err) {
        res.status(400).json({message: err.message})
    }
});

router.get('/:deviceId/details', async (req, res) => {
    try {
        let deviceId = req.params.deviceId
        let device = await deviceService.getOne(deviceId)
        if (!device) {
            throw new Error('Not found')
        }
        res.json(device)

    } catch (err) {
        res.status(404).json({message: err.message})
    }

});
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@

router.get('/:deviceId', isAuth, async (req, res) => {
    let deviceId = req.params.deviceId;
    let userId = req.user._id;

    try {
        await deviceService.prefer(req.params.deviceId, req.user._id);
        let user = await authService.getInfo(userId);
        console.log(user)
        // await deviceService.delete(deviceId);
        res.status(200).json(user)

    } catch (err) {
        res.status(404).json({message: err.message})
    }


});

//@@@@@@@@@@@@@@@@@@


router.delete('/:deviceId', isAuth, async (req, res) => {
    let deviceId = req.params.deviceId
    console.log(deviceId)
    try {
        await deviceService.delete(req.params.deviceId)
        res.status(204).end()
    } catch (err) {
        res.status(401).json({message: err.message})
    }
})


router.put('/:deviceId', isAuth, async (req, res) => {
    const deviceData = req.body;

    try {
        await deviceService.edit(req.params.deviceId, deviceData);
        res.status(204).end();
    } catch (err) {
        res.status(401).json({message: err.message})
    }

})


router.post('/delete-multiple', isAuth, async (req, res) => {
    const {deviceIds} = req.body;
    console.log(deviceIds)

    try {

        await deviceService.deleteMultiple(deviceIds);
        res.status(200).json({message: "Devices deleted successfully!"});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});
module.exports = router;