const nodemailer = require("nodemailer");
const { google } = require('googleapis');
const REDIRECT_URI = `https://developers.google.com/oauthplayground`;
const CLIENT_ID = `enter your clientid`;
const CLIENT_SECRET = `enter your client secret`;
const REFRESH_TOKEN = `enter the refresh token`;

const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
async function mailer(email, verificationToken, userId) {
    try {
        const ACCESS_TOKEN = await oAuth2Client.getAccessToken();
        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "shachisoni0352@gmail.com",
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: ACCESS_TOKEN
            }

        });

        const verificationLink = `http://localhost:8000/verify/${userId}/${verificationToken}`;
        const details = {
            from: "admin name <shachisoni0352@gmail.com>",
            to: "useremail",
            subject: "Email Verification",
            text: "Please click the link below to verify your email address.",
            html: `<a href="${verificationLink}">Verify Email yeahhh</a>`
        };


        const result = await transport.sendMail(details);
        return result;
    } catch (err) {
        return err;
    }
}

mailer().then(res => {
    console.log("sent mail!", res);
})

module.exports = mailer;
