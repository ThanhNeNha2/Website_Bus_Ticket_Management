import React from "react";

const ContactInfo = () => {
  return (
    <div className="bg-gray-700 text-white py-12 px-10 ">
      <div className="container mx-auto flex flex-col md:flex-row items-center">
        {/* Bản đồ Google Maps */}
        <div className="md:w-1/2 mb-6 md:mb-0">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.447251149714!2d106.6986655!3d10.7769877!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f38f747b2c5%3A0x1e6b34c0b0b1e0a5!2zMTIzIMSQxrDhu59uZyBMw6ogTOG7oWksIFBoxrDhu6VuZyBC4bq_biBUaMOgbmgsIFF14bqtbiAxLCBUaMOgbmggcGjhu5EgSOG7kyBDaMOtIE1pbmgsIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1696801234567!5m2!1svi!2s"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Maps"
          ></iframe>
        </div>

        {/* Thông tin liên hệ kiểu hiện đại */}
        <div className="md:w-1/2 md:pl-16">
          <h2 className="text-3xl font-bold mb-8 text-white">Contacts</h2>
          <div className="space-y-6 text-white">
            {[
              {
                label: "Tel",
                text: "1900 9999",
                href: "tel:19009999",
                icon: (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M3 5a16 16 0 0016 16l3-3a2 2 0 00-1-3c-2 0-3-.5-4-2s-2-2-2-4a2 2 0 00-3-1l-3 3z" />
                  </svg>
                ),
              },
              {
                label: "Email",
                text: "hotro@vexetoanquoc.vn",
                href: "mailto:hotro@vexetoanquoc.vn",
                icon: (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4 4h16v16H4z" stroke="none" />
                    <path d="M22 6l-10 7L2 6" />
                  </svg>
                ),
              },
              {
                label: "Address",
                text: "123 Đường Lê Lợi, Quận 1, TP. HCM",
                href: "#",
                icon: (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2a8 8 0 00-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 00-8-8z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                ),
              },
              {
                label: "Facebook",
                text: "fb.com/vexetoanquoc",
                href: "https://fb.com/vexetoanquoc",
                icon: (
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22 12a10 10 0 10-11 10V14h-3v-3h3V9a3 3 0 013-3h3v3h-3a1 1 0 00-1 1v2h4l-1 3h-3v8a10 10 0 0010-10z" />
                  </svg>
                ),
              },
              {
                label: "Telegram",
                text: "zalo.me/vexetoanquoc",
                href: "https://zalo.me/vexetoanquoc",
                icon: (
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M21.5 2.5l-1.8 8.5L12 9.5l3.5 4-5-5L2.5 12l9 9 1-4 5 2 4-16z" />
                  </svg>
                ),
              },
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                {/* Icon trong ô nền cam vuông */}
                <div className="bg-orange-600 p-3 rounded-lg flex items-center justify-center w-12 h-12">
                  {item.icon}
                </div>

                {/* Nội dung */}
                <div className="flex flex-col">
                  <span className="text-sm text-gray-400">{item.label}</span>
                  <a
                    href={item.href}
                    className="text-white font-semibold underline hover:text-orange-400 transition duration-200"
                  >
                    {item.text}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
