import nodemailer from "nodemailer"
import SMTPTransport from "nodemailer/lib/smtp-transport"

export interface optionsEmail {
  from?: string,
  to: string,
  subject: string,
  html: string,
  text?: string
}

const sendEmail = async (options: optionsEmail): Promise<void> => {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE as string,
    auth: {
      user: process.env.EMAIL_ACCOUNT as string,
      pass: process.env.EMAIL_PASS as string
    }
  })

  const mailOptions: optionsEmail = {
    from: process.env.EMAIL_FROM as string,
    to: options.to,
    subject: options.subject,
    html: options.html
  }

  transporter.sendMail(mailOptions, function(err: Error | null, info: SMTPTransport.SentMessageInfo) {
    if(err) {
      console.log(err)
    }
    else {
      console.log(info)
    }
  })
}

export default sendEmail