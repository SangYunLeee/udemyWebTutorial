
const Campground = require('./models/campground');
const Review = require('./models/review');
const {campgroundSchema, reviewSchema} = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');


const isLoggedIn = ( req, res, next ) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'you must be signed in');
        return res.redirect('/login');
    }
    next();
}

const validateOwner = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    // 작성자가 맞는지 확인
    console.log(campground.author)
    console.log(req.user._id)
    if(!campground.author.equals(req.user._id)) {
        req.flash('error', '넌 변경할 수 없어, 돌아가');
        return res.redirect(`/campgrounds/${req.params.id}`);
    }
    next();
}

const validateReviewOwner = async (req, res, next) => {
    const review = await Review.findById(req.params.reviewId);
    // 작성자가 맞는지 확인
    if(review.author != (req.user._id)) {
        req.flash('error', '넌 변경할 수 없어, 돌아가');
        return res.redirect(`/campgrounds/${req.params.id}`);
    }
    next();
}

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isLoggedIn = isLoggedIn;
module.exports.validateOwner = validateOwner;
module.exports.validateCampground = validateCampground;
module.exports.validateReview = validateReview;