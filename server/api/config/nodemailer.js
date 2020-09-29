const nodemailer = require("nodemailer")

const user = process.env.HOST_MAIL
const pass = process.env.HOST_PASSWORD
const baseUrl = process.env.BASE_URL

// create reusable transporter object using the default SMTP transport
exports.sendMail = (receiver, token, type) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user, // generated ethereal user
            pass // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
    })

    const urlConfirmation = `${baseUrl}/users/signup/confirmation/${token}`
    const urlRecovery = `${baseUrl}/users/reset/${token}`

    const mailOptionsConfirmation = {
        from: '"The Walker ✔ "<bathanggayk18@gmail.com>', // sender address
        to: receiver, // list of receivers
        subject: "Verify you account", // Subject line
        text: "Become to me. Welcome to the new life!", // plain text body
        html: `<b>Click this link: </b> <hr> <a href=${urlConfirmation}>${urlConfirmation}</a>`, // html body
    }

    const mailOptionsRecovery = {
        from: '"The Walker ✔ "<bathanggayk18@gmail.com>', // sender address
        to: receiver, // list of receivers
        subject: "Recovery password", // Subject line
        text: `Please click on the below link to reset your password. \n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`, // plain text body
        html: `<b>Link: </b> <hr> <a href=${urlRecovery}>${urlRecovery}</a>`, // html body
    }

    // send mail with defined transport object
    transporter.sendMail(type === 'confirmation' ? mailOptionsConfirmation : mailOptionsRecovery, (error, data) => {
        if(error){
            console.log({
                msg: 'error',
                error
            })
        }else{
            console.log({
                msg: 'success',
                data
            })
        }
    })
}