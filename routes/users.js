const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

const User = require('../models/user');
const passport = require('passport');

router.route('/register')
    .get((req, res) => {
        res.render('users/register');
    })
    .post(catchAsync(async (req, res, next) => {
        try {
            const { email, username, password } = req.body;
            const user = new User({ email, username});
            const registeredUser = await User.register(user, password);
            req.login(registeredUser, err => {
                if(err) {
                    return next(err);
                }
                req.flash('success','Welcome to Yelp Camp');
                res.redirect('/campgrounds');
            });
        } catch (e) {
            req.flash('error', e.message);
            res.redirect('register');
        }
    }));

router.route('/login')
    .get(async (req, res) => {
        res.render('users/login');
    })
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}) , async (req, res) => {
        req.flash('success', 'welcome back');
        const redirectUrl = req.session.returnTo || '/campgrounds';
        delete req.session.returnTo;
        res.redirect(redirectUrl);
    });

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/campgrounds');
});

module.exports = router;