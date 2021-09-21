const Mailgen = require('mailgen');
require('dotenv').config();
class EmailService {
  constructor(env, sender) {
    this.sender = sender;

    switch (env) {
      case 'development':
        this.link = 'https://1dcb-89-21-72-119.ngrok.io';
        break;
      case 'production':
        this.link = 'link from production';
        break;
      default:
        this.link = 'https://1dcb-89-21-72-119.ngrok.io';
        break;
      
    }
    console.log(this.link);
  };
 
  #createTemplateVerificationEmail(verifyToken, name) {
    const mailGenerator = new Mailgen({
      theme: 'neopolitan',
      product: {
        name: 'MPh System',
        link: this.link,
      },
    });

    const email = {
      body: {
        name,
        intro: "Welcome MPh System! We're very excited to have you on board.",
        action: {
          instructions: 'To get started with MPh System, please click here:',
          button: {
            color: '#22BC66',
            text: 'Confirm your account',
            link: `${this.link}/api/users/verify/${verifyToken}`,
          },
        },
        outro:
          "Need help, or have questions? Just reply to this email, we'd love to help.",
      },
    };
    return mailGenerator.generate(email);
  };

  async sendVerifyEmail(verifyToken, email) {
    const emailHtml = this.#createTemplateVerificationEmail(verifyToken, email);
    const message = {
      to: email,
      subject: 'Verify your account',
      html: emailHtml,
    };

    const result = await this.sender.send(message);
    console.log(result);
  };
};

module.exports = EmailService;