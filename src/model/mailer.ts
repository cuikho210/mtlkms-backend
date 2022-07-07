import * as nodemailer from 'nodemailer';

interface MailData {
    to: string;
    subject: string;
    body: string;
}

class Mailer {
    public send(data: MailData) {
        let transporter = nodemailer.createTransport({ // config mail server
            host: process.env.EMAIL_HOST || 'smtp.gmail.com',
            port: process.env.EMAIL_PORT || 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            },
            tls: {
                // do not fail on invalid certs
                rejectUnauthorized: false
            }
        });

        let content = data.body;

        let options = {
            from: 'Vịt Chúa',
            to: data.to,
            subject: data.subject,
            html: content
        };

        transporter.sendMail(options, (err, info) => {
            if (err) {
                console.log('\n---------------- \x1b[35m[model/mailer send]\x1b[0m -----------------');
                console.log('', '[model/mailer.ts send]');
                console.log(new Date().toLocaleString('vi-VN') + '\n');
                
                console.log(err);
                console.log('------------------------------------------------------\n');
            } else {
                console.log('\n---------------- \x1b[35m[model/mailer send]\x1b[0m -----------------');
                console.log(new Date().toLocaleString('vi-VN') + '\n');

                console.log('Message sent success!');
                console.log('To:', data.to);
                console.log('Subject:', data.subject);
                console.log('------------------------------------------------------\n');
            }
        });
    }
}

export default new Mailer();