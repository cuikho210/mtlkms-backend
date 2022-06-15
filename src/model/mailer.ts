import * as nodemailer from 'nodemailer';
import { gmailpwd } from '../pwd';

class Mailer {
    public send(data: any) {
        let transporter = nodemailer.createTransport({ // config mail server
            host: 'smtp.gmail.com',
            port: 587,
            secure: true,
            auth: {
                user: 'mtlkms44@gmail.com',
                pass: gmailpwd
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
                console.log(err);
            } else {
                console.log('Message sent: ' + info.response);
            }
        });
    }
}

export default new Mailer();