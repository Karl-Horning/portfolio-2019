const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const expressHandlebars = require('express-handlebars');
const app = express();

// View engine setup
app.engine('handlebars', expressHandlebars());
app.set('view engine', 'handlebars');

// // Static folders
app.use(express.static(`${__dirname}/public`));
app.use(express.static(`${__dirname}/views`));

// Body Parser middleware
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.post('/', (req, res) => {
    const senderName = req.body.name;
    const senderEmail = req.body.email;
    const senderNoBots = req.body.bots;
    const senderMessage = req.body.message;

    const htmlOutput = `
      <p>You have a new Message</p>
      <h3>Contact Details</h3>
      <ul>  
        <li>Name: ${senderName}</li>
        <li>Email: ${senderEmail}</li>
      </ul>
      <h3>Message</h3>
      <p>${senderMessage}</p>
    `;

    const textOutput = `
        YOU HAVE A NEW MESSAGE
      
        -Contact Details-
        
        Name: ${senderName}
        Email: ${senderEmail}

        -Message-
        ${senderMessage}
    `;

    // Check if any invisible fields are filled in
    let emailSubject = 'You have received a new message';
    if(senderNoBots) {
        emailSubject = '*****POSSIBLE SPAM*****'
    }

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'iCloud',
        auth: {
            user: process.env.NODEMAILER_USERNAME, // NODEMAILER_USERNAME
            pass: process.env.NODEMAILER_PASSWORD // NODEMAILER_PASSWORD
        },
        // For localhost testing
        tls: {
            rejectUnauthorized: false
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: `"Nodemailer Contact" <${process.env.NODEMAILER_USERNAME}>`, // sender address
        to: process.env.NODEMAILER_USERNAME, // list of receivers
        subject: emailSubject, // Subject line
        text: textOutput, // plain text body
        html: htmlOutput // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            res.render('index', {
                msg: `Something went wrong. Please try again later. ${error}`
            });
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        
        // Redirect & render stops form data from being resubmitted on refresh
        res.redirect('/sent');
    });
});

app.get('/sent', (req, res) => {
    // Redirect & render stops form data from being resubmitted on refresh
    res.render('index', {
        msg: `Thank you. Your message has been sent.`
    });
});

// Run the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.info(`The server is available at http://localhost:${PORT}`));