import React from "react";

const ContactInfo = () => {
  return (
    <div className="bg-black text-white py-12 px-10">
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

        {/* Thông tin liên hệ */}
        <div className="md:w-1/2 md:pl-8">
          <h2 className="text-3xl font-bold mb-6">Contacts</h2>
          <div className="space-y-4">
            {/* Điện thoại */}
            <div className="flex items-center">
              <span className="text-orange-500 mr-3">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M6.62 10.79a15.07 15.07 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.22 11.36 11.36 0 003.54.56 1 1 0 011 1v3.5a1 1 0 01-1 1A18 18 0 013 6a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.56 3.54 1 1 0 01-.22 1.11l-2.2 2.2z" />
                </svg>
              </span>
              <p>1900 9999</p>
            </div>

            {/* Email */}
            <div className="flex items-center">
              <span className="text-orange-500 mr-3">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </span>
              <p>hotro@vexetoanquoc.vn</p>
            </div>

            {/* Địa chỉ */}
            <div className="flex items-center">
              <span className="text-orange-500 mr-3">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2a8 8 0 00-8 8c0 5.22 6.61 11.29 7.39 12.07a1 1 0 001.22 0C13.39 21.29 20 15.22 20 10a8 8 0 00-8-8zm0 11a3 3 0 110-6 3 3 0 010 6z" />
                </svg>
              </span>
              <p>123 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP.HCM</p>
            </div>

            {/* Facebook */}
            <div className="flex items-center">
              <span className="text-orange-500 mr-3">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 12a10 10 0 10-11 10V14h-3v-3h3V9a3 3 0 013-3h3v3h-3a1 1 0 00-1 1v2h4l-1 3h-3v8a10 10 0 0010-10z" />
                </svg>
              </span>
              <p>fb.com/vexetoanquoc</p>
            </div>

            {/* Telegram */}
            <div className="flex items-center">
              <span className="text-orange-500 mr-3">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M21.5 2.5l-1.8 8.5L12 9.5l3.5 4-5-5L2.5 12l9 9 1-4 5 2 4-16z" />
                </svg>
              </span>
              <p>zalo.me/vexetoanquoc</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
