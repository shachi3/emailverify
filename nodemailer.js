const nodemailer = require("nodemailer");
const { google } = require('googleapis');
const REDIRECT_URI = `https://developers.google.com/oauthplayground`;
const CLIENT_ID = `214047610414-4oh291okff0p20h6pb0a5b39hnked6r1.apps.googleusercontent.com`;
const CLIENT_SECRET = `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`;
const REFRESH_TOKEN = `ya29.a0AbVbY6PA381WBv44SeAzUum61LM5KdxM7rxIu3kgMNIOuyi-wso4d38Cz05sX2nl70PLE-gbeWYb3SI0LcN3TsNEgZd7NonXiJT7SE0JTPrEy3QmaSYL_7FuB_uQrijoUDSK7nHkYASbZNVQV-HviKMtW0PMJeICaCgYKAQQSARMSFQFWKvPl7D7p-rsyJUj3K_lpKS-AVw0167`;

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