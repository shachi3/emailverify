var express = require('express');
var router = express.Router();
var mailer = require("../nodemailer");
var crypto = require("crypto");

var express = require('express');
const passport = require('passport');

const userModel = require('./users');

const localSrategy = require("passport-local");

passport.use(new localSrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});

// Function to generate a random verification token
function generateVerificationToken() {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(32, (err, buffer) => {
            if (err) {
                return reject(err);
            }
            const token = buffer.toString('hex');
            resolve(token);
        });
    });
}
router.post("/register", async function(req, res) {
    try {
        const verificationToken = await generateVerificationToken();

        var userDetails = new userModel({
            email: req.body.email,
            username: req.body.username,
            emailVerificationToken: verificationToken,
            emailVerificationTokenExpiresAt: Date.now() + 3600000, // Token valid for 1 hour (adjust as needed)
        });

        // Save the user details to the database
        await userDetails.save();

        // Send the verification email
        mailer(req.body.email, verificationToken, userDetails._id)
            .then((result) => {
                console.log("Email sent!", result);
                res.send("Registration successful! Please check your email for verification.");
            })
            .catch((error) => {
                console.error("Error sending email:", error);
                res.send("Registration successful! Failed to send verification email.");
            });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).send("Error registering user.");
    }
});


// Email verification route
router.get('/verify/:userId/:token', async function(req, res, next) {
    const { userId, token } = req.params;
    const user = await userModel.findById(userId);

    if (!user) {
        console.log("hii");
        return res.status(404).send("User not found.");
    }


    if (user.emailVerificationToken !== token || user.emailVerificationTokenExpiresAt <= Date.now()) {
        return res.status(400).send("Invalid or expired verification link.");
    }


    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpiresAt = undefined;


    await user.save();

    res.send("Email verification successful! You can now log in.");
});

module.exports = router;