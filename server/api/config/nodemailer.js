const nodemailer = require("nodemailer")

const user = process.env.HOST_MAIL
const pass = process.env.HOST_PASSWORD

// create reusable transporter object using the default SMTP transport
exports.sendMail = (req, receiver, token, type) => {
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

    const urlConfirmation = `http://${req.hostname}/users/signup/confirmation/${token}`

    const mailOptionsConfirmation = {
        from: '"The Walker ✔ "<bathanggayk18@gmail.com>', // sender address
        to: receiver, // list of receivers
        subject: "Verify you account", // Subject line
        text: "Come with me. Welcome to the new life! \n\n Please click on the below link to verify your account\n", // plain text body
        html: `<b>Link: </b> <hr> <a href=${urlConfirmation}>${urlConfirmation}</a>`, // html body
    }

    const mailOptionsRecovery = {
        from: '"The Walker ✔ "<bathanggayk18@gmail.com>', // sender address
        to: receiver, // list of receivers
        subject: "Recovery password", // Subject line
        text: `Your token here. Please copy! \n\n`, // plain text body
        html: `<b>Token: </b> <hr> ${token}`, // html body
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