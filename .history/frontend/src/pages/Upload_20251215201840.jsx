import { useState } from "react";
import API from "../services/api";

export default function Upload() {
  const [file, setFile] = useState(null);

  const uploadHandler = async () => {
    const formData = new FormData();
    formData.append("file", file);

    await API.post("/documents/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    alert("Document uploaded successfully");
  };

  return (
    <div>
      <h2>Upload Invoice</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={uploadHandler}>Upload</button>
    </div>
  );
}
