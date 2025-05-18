const nodemailer = require("nodemailer");
const fs = require("fs");
const handlebars = require("handlebars");
const path = require("path");

const sendEmail = async (
  busCompanyName,
  nameCustomer,
  tripName,
  ticketCode,
  price,
  travelDate,
  departureTime,
  toEmail
) => {
  // Đọc template từ file
  const templateSource = fs.readFileSync(
    path.join(__dirname, "../public/bookTicket.hbs"),
    "utf8"
  );

  // Compile template
  const template = handlebars.compile(templateSource);

  // Dữ liệu động
  const replacements = {
    busCompanyName: busCompanyName,
    nameCustomer: nameCustomer,
    tripName: tripName,
    travelDate: travelDate,
    price: price,
    departureTime: departureTime,
    ticketCode: ticketCode,
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
    subject: "Thông báo đặt vé xe  ", // Subject line
    text: "Thông báo đặt vé xe ", // plain text body
    html: emailHtml,
  });
};

module.exports = {
  sendEmail,
};
