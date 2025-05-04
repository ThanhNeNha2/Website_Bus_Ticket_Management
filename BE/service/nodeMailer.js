const nodemailer = require("nodemailer");
const fs = require("fs");
const handlebars = require("handlebars");
const path = require("path");

export const sendEmail = async (name, activationCode, toEmail) => {
  // Đọc template từ file
  const templateSource = fs.readFileSync(
    path.join(__dirname, "../public/bookTicket.hbs"),
    "utf8"
  );

  // Compile template
  const template = handlebars.compile(templateSource);

  // Dữ liệu động
  const replacements = {
    name: name,
    activationCode: activationCode,
  };

  // Tạo HTML từ template và dữ liệu động
  const emailHtml = template(replacements);

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: process.env.EMAIL_APP,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });
  const info = await transporter.sendMail({
    from: "ta.coaching.v2@gmail.com", // sender address
    to: toEmail, // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: emailHtml,
  });
};
