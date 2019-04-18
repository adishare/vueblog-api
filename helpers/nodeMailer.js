const nodemailer = require('nodemailer');

module.exports = {

    sendEmail(to,subject,htmlcontent){
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'h8ikeid@gmail.com',
                pass: 'rahasia123456'
            }
        });

        const mailOptions = {
            from: 'h8ikeid@gmail.com', 
            to: to, 
            subject: subject, 
            html: htmlcontent
        };


        return transporter.sendMail(mailOptions)

    }

}