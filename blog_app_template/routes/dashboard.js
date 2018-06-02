let express = require('express');
let router = express.Router();

router.get('/', (req, res, next) => {
    res.redirect('https://engrave.website/dashboard');
});

module.exports = router;