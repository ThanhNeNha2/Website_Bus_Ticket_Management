import { Construction } from "lucide-react";

export default function Note() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center">
        <div className="flex justify-center mb-4 text-yellow-500">
          <Construction size={48} />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Tính năng đang được phát triển
        </h1>
        <p className="text-gray-600">
          Chức năng hiện chưa khả dụng. Chúng tôi đang làm việc để sớm ra mắt
          trong các bản cập nhật tiếp theo.
        </p>
        <button
          onClick={() => window.history.back()}
          className="mt-6 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Quay lại
        </button>
      </div>
    </div>
  );
}
