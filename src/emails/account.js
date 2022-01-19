const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeMail = (email, name)=>{
    sgMail.send({
        to: email,
        from: 'adeniyidamilola246@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app`
    })
}

const sendClosingMail = (email, name)=>{
    sgMail.send({
        to: email,
        from: 'adeniyidamilola246@gmail.com',
        subject: 'Thanks for using our service',
        text: `Good bye ${name}. Let me know how we could have served you better in using the app`
    })
} 

module.exports = {
    sendWelcomeMail,
    sendClosingMail
}