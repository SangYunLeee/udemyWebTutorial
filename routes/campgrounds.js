const express = require('express');
const router = express.Router();
const campgroundCtl = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');

const multer  = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage});

const {isLoggedIn, validateCampground, validateOwner} = require('../middleware');

router.route('/')
    .get(catchAsync(campgroundCtl.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgroundCtl.createCampground));
    // .post(isLoggedIn , validateCampground, catchAsync(campgroundCtl.createCampground));

router.get('/new', isLoggedIn , campgroundCtl.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgroundCtl.showCampground))
    .put(isLoggedIn, validateOwner, upload.array('image'), validateCampground, catchAsync(campgroundCtl.updateCampground))
    .delete(isLoggedIn, validateOwner, catchAsync(campgroundCtl.deleteCampground));

router.get('/:id/edit', isLoggedIn ,validateOwner ,catchAsync(campgroundCtl.renderEditForm));


module.exports = router;