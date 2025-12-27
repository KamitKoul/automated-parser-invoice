import { useState, useRef } from "react";
import API from "../services/api";
import { toast } from "react-toastify";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef();

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
      inputRef.current.value = null;
      setTimeout(() => setProgress(0), 800);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Upload Invoice</Typography>

      <input
        type="file"
        ref={inputRef}
        style={{ display: 'none' }}
        onChange={(e) => setFile(e.target.files[0])}
        id="file-input"
      />

      <label htmlFor="file-input">
        <Button variant="contained" component="span">Choose File</Button>
      </label>

      <Typography variant="body2" style={{ marginTop: 8 }}>{file ? file.name : 'No file selected'}</Typography>

      <Box sx={{ mt: 2 }}>
        <Button variant="contained" color="primary" onClick={uploadHandler} disabled={uploading}>
          {uploading ? `Uploading ${progress}%` : 'Upload'}
        </Button>
      </Box>

      {uploading && (
        <Box sx={{ mt: 2 }}>
          <LinearProgress variant="determinate" value={progress} />
          <Typography variant="caption">{progress}%</Typography>
        </Box>
      )}
    </Box>
  );
}
