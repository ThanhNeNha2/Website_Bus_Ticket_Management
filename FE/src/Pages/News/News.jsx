import React from "react";
import {
  Calendar,
  TrendingUp,
  MapPin,
  Clock,
  Eye,
  ArrowRight,
} from "lucide-react";

const News = () => {
  const newsData = [
    {
      id: 1,
      title: "Mẹo đặt vé xe ngày lễ",
      description:
        "Cách tránh hết vé và mua đúng giờ khởi hành mong muốn. Những kinh nghiệm hữu ích cho chuyến đi thuận lợi.",
      image:
        "https://i.pinimg.com/736x/0a/c9/05/0ac9050c5f6cac02257aa9b162559726.jpg",
      icon: <Calendar className="w-5 h-5" />,
      date: "15 Thg 5, 2025",
      readTime: "3 phút đọc",
      views: "1.2k",
      category: "Mẹo hay",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: 2,
      title: "Xu hướng xe khách 2025",
      description:
        "Xe giường đôi, xe điện, tiện ích trên xe được nâng cấp. Khám phá những công nghệ mới nhất trong ngành vận tải.",
      image:
        "https://i.pinimg.com/736x/0a/c9/05/0ac9050c5f6cac02257aa9b162559726.jpg",
      icon: <TrendingUp className="w-5 h-5" />,
      date: "12 Thg 5, 2025",
      readTime: "5 phút đọc",
      views: "2.1k",
      category: "Xu hướng",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      id: 3,
      title: "Tuyến xe mới ra mắt",
      description:
        "Giới thiệu tuyến TP.HCM - Phú Quốc qua trạm trung chuyển Hà Tiên. Trải nghiệm hành trình độc đáo.",
      image:
        "https://i.pinimg.com/736x/0a/c9/05/0ac9050c5f6cac02257aa9b162559726.jpg",
      icon: <MapPin className="w-5 h-5" />,
      date: "10 Thg 5, 2025",
      readTime: "4 phút đọc",
      views: "856",
      category: "Tuyến mới",
      gradient: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <div className="py-20 px-6 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
            <span>Tin tức mới nhất</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Cập nhật
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              {" "}
              tin tức{" "}
            </span>
            mới nhất
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Khám phá những thông tin hữu ích, xu hướng mới và các tuyến đường
            được cập nhật liên tục
          </p>
        </div>

        {/* News Grid */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
          {newsData.map((article, index) => (
            <article
              key={index}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-orange-200 transform hover:-translate-y-2"
            >
              {/* Image Container */}
              <div className="relative overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-48 object-cover transition-all duration-700 group-hover:scale-110"
                />

                {/* Gradient Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${article.gradient} opacity-0 group-hover:opacity-80 transition-opacity duration-300`}
                ></div>

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center space-x-1 bg-white bg-opacity-90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                    {article.icon}
                    <span>{article.category}</span>
                  </span>
                </div>

                {/* Read More Button (appears on hover) */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="bg-white text-gray-900 px-6 py-2 rounded-full font-medium flex items-center space-x-2 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <span>Đọc thêm</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{article.date}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{article.readTime}</span>
                    </span>
                  </div>
                  <span className="flex items-center space-x-1">
                    <Eye className="w-3 h-3" />
                    <span>{article.views}</span>
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors duration-300 line-clamp-2">
                  {article.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                  {article.description}
                </p>

                {/* Bottom Action */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button className="text-orange-600 font-medium text-sm flex items-center space-x-1 group-hover:space-x-2 transition-all duration-300">
                    <span>Xem chi tiết</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
            Xem tất cả tin tức
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-orange-100 rounded-full opacity-50"></div>
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-blue-100 rounded-full opacity-30"></div>
        </div>
      </div>
    </div>
  );
};

export default News;
