const nodemailer = require('nodemailer');

const { emailTemplate } = require('./../utils/constant');

const HOST_MAIL = process.env.HOST_MAIL;
const HOST_PASSWORD = process.env.HOST_PASSWORD;

// create reusable transporter object using the default SMTP transport
exports.sendMail = (req, receiver, token, type) => {
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		port: 587,
		secure: false, // true for 465, false for other ports
		auth: {
			user: HOST_MAIL, // generated ethereal HOST_MAIL
			pass: HOST_PASSWORD, // generated ethereal HOST_PASSWORD
		},
		tls: {
			rejectUnauthorized: false,
		},
	});

	const urlConfirmation = `http://${req.hostname}/users/confirm/${token}`;

	const mailOptionsConfirmation = {
		from: '"The Walker ✔ "<bathanggayk18@gmail.com>', // sender address
		to: receiver, // list of receivers
		subject: 'Verify you account', // Subject line
		text: '',
		html: emailTemplate('confirm', receiver, urlConfirmation),
	};

	const mailOptionsRecovery = {
		from: '"The Walker ✔ "<bathanggayk18@gmail.com>', // sender address
		to: receiver, // list of receivers
		subject: 'Recovery password', // Subject line
		text: ``, // plain text body
		html: emailTemplate('reset', receiver, token),
	};

	// send mail with defined transport object
	transporter.sendMail(
		type === 'confirm' ? mailOptionsConfirmation : mailOptionsRecovery,
		(error, data) => {
			if (error) {
				console.log({
					msg: 'error',
					error,
				});
			} else {
				console.log({
					msg: `Send the email to ${receiver} successfully!`,
				});
			}
		}
	);
};
