const sgMail = require('@sendgrid/mail')
const sendgridAPIKey = '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'

sgMail.setApiKey(sendgridAPIKey)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'vkumar@argusoft.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    })
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'andrew@mead.io',
        subject: 'Sorry to see you go!',
        text: `Goodbye, ${name}. I hope to see you back sometime soon.`
    })
}

module.exports = {
    sendWelcomeEmail,
    // sendCancelationEmail
}