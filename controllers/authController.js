const router = require('express').Router();
const authService = require('../services/authService');
const {getErrorMessage} = require("../utils/errorUtils");
const {isGuest, isAuth} = require("../middlewares/authMiddleWare");


router.post('/register', async (req, res) => {

    try {
        const result = await authService.register(req.body);
        res.cookie('auth', result.accessToken, {httpOnly: true, sameSite: 'none', secure: true});

        res.json(result);

    } catch (err) {
        res.status(401).json({message: "err"})
        console.log("wrong")
    }

});

router.post('/login', async (req, res) => {
    const userData = req.body;
    console.log(userData)
    try {

        const result = await authService.login(userData);

        res.cookie('auth', result.accessToken, {httpOnly: true, sameSite: 'none', secure: true});

        res.json(result);

    } catch (err) {
        res.status(401).json({message: "err"})
        console.log("wrong")
    }

})

router.post('/logout', (req, res) => {
    res.clearCookie('auth')
    res.end()
});


router.get('/profile', isAuth, async (req, res) => {
    const id = req.user?._id
    console.log(id)

    try {
        let user = await authService.getInfo(id)
        console.log(user)
        res.json(user)
    } catch (err) {
        res.status(400).json({
            message: "err"
        })
    }
})

router.put('/profile', isAuth, async (req, res) => {
    const id = req.user?._id
    const userData = req.body;
    console.log(userData)

    try {
        const {user, token} = await authService.edit(id, userData);

        res.cookie('auth', token, {httpOnly: true, secure: true}); // или според конфигурацията ви
        res.status(200).json(user);

    } catch (err) {
        res.status(400).json({
            message: "err"
        })
    }
})


module.exports = router;