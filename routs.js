const router = require('express').Router();


const homeController = require('./controllers/homeController');
const authController = require('./controllers/authController');
const deviceController = require('./controllers/deviceController');


router.use('/auth',authController);
router.use('/devices', deviceController);



router.all('*', (req, res) => {
   console.log('error')
})

module.exports = router;