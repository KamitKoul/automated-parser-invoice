import { useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const uploadHandler = async () => {
    if (!file) return toast.error("Please choose a file to upload");
    const allowed = ["application/pdf", "image/png", "image/jpeg"];
    if (!allowed.includes(file.type)) return toast.error("Only PDF and image files are allowed");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      setProgress(0);
      await API.post("/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          const p = Math.round((e.loaded * 100) / e.total);
          setProgress(p);
        }
      });

      toast.success("Document uploaded successfully");
      setFile(null);
      setTimeout(() => {
        setProgress(0);
      }, 800);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h2>Upload Invoice</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />

      <div style={{ marginTop: 8 }}>
        <button onClick={uploadHandler} disabled={uploading}>
          {uploading ? `Uploading ${progress}%` : "Upload"}
        </button>
      </div>

      {uploading && (
        <div style={{ marginTop: 8, width: "100%", background: "#eee", height: 8 }}>
          <div style={{ width: `${progress}%`, height: 8, background: "#4caf50" }} />
        </div>
      )}
    </div>
  );
}
