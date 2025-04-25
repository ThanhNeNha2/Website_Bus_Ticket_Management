import axios from "axios";

const upload = async (file, value) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "Website_Bus_Ticket_Management"); // Đúng với preset bạn đã tạo

  if (value === "car") {
    data.append(
      "folder",
      "Website_Bus_Ticket_Management/Website_Bus_Ticket_Management_Car"
    );
  }

  if (value === "user") {
    data.append(
      "folder",
      "WebSite-ecommerce-interior/WebSite-ecommerce-interior-user"
    );
  }
  try {
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dche1cjwo/image/upload",
      data
    );
    const { secure_url, public_id } = res.data;
    console.log(" check thu thong tin id de xoa ", public_id);

    if (!secure_url || !public_id) {
      throw new Error("Upload failed: Missing secure_url or public_id");
    }

    return secure_url;
  } catch (err) {
    console.error("Error uploading file:", err);
  }
};

export default upload;
