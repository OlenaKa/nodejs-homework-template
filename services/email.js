const Mailgen = require('mailgen')
const sgMail = require('@sendgrid/mail')
require('dotenv').config()
sgMail.setApiKey(process.env.SENGRID_API_KEY)

class VerificationEmailService {
  constructor(env) {
    switch (env) {
      case 'development':
        this.link = 'http://localhost:3000'
        break
      case 'production':
        this.link = 'someDomainName'
        break
      default:
        this.link = 'http://localhost:3000'
        break
    }
  }
  #generateEmail(verifyToken) {
    const mailGenerator = new Mailgen({
      theme: 'salted',
      product: {
        name: 'Hello World',
        link: this.link,
      },
    })

    const email = {
      body: {
        greeting: 'Dear User',
        intro:
          "Welcome to Hello World! We're very excited to have you on board.",
        action: {
          instructions: 'To get started with Hello World, please click here:',
          button: {
            color: '#22BC66',
            text: 'Confirm your account',
            link: `${this.link}/api/users/verify/${verifyToken}`,
          },
        },
      },
    }
    return mailGenerator.generate(email)
  }

  async sendVfEmail(verifyToken, email, name) {
    const template = this.#generateEmail(verifyToken)
    const message = {
      to: email,
      subject: 'Hello World verification',
      html: template,
    }

    const result = await sgMail.send({
      ...message,
      from: process.env.EMAIL_FOR_SERVICE,
    })
    console.log(result)
  }
}

module.exports = VerificationEmailService
