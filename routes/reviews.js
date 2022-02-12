const express = require('express');
const router = express.Router({mergeParams: true});

const Campground = require('../models/campground');
const Review = require('../models/review');
const reviewCtl = require('../controllers/reviews');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, validateReview} = require('../middleware');

// FOR REVIEW_MAP
router.post('/', isLoggedIn, validateReview, catchAsync(reviewCtl.createReview));

router.delete('/:reviewId', isLoggedIn, catchAsync(reviewCtl.deleteReview));

module.exports = router;