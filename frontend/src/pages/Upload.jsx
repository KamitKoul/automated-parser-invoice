import { useState, useRef } from "react";
import API from "../services/api";
import { toast } from "react-toastify";
import { 
  Box, 
  Button, 
  Typography, 
  LinearProgress, 
  Paper, 
  IconButton
} from '@mui/material';
import { CloudUpload, Delete, InsertDriveFile } from '@mui/icons-material';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const clearFile = () => {
    setFile(null);
    if (inputRef.current) inputRef.current.value = null;
    setProgress(0);
  };

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
      clearFile();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom textAlign="center">
        Upload Invoice
      </Typography>
      <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
        Upload your invoice (PDF or Image) to extract data automatically.
      </Typography>

      <Paper 
        variant="outlined" 
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        sx={{ 
          p: 4, 
          textAlign: 'center', 
          borderStyle: 'dashed', 
          borderWidth: 2, 
          borderColor: dragActive ? 'secondary.main' : 'primary.light',
          bgcolor: dragActive ? 'rgba(37, 99, 235, 0.04)' : 'background.paper',
          transition: 'all 0.2s ease-in-out',
          position: 'relative'
        }}
      >
        <CloudUpload sx={{ fontSize: 60, color: dragActive ? 'secondary.main' : 'primary.main', mb: 2 }} />
        
        <Typography variant="h6" gutterBottom>
          {dragActive ? 'Drop your file here' : 'Select a file to upload'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Supported formats: PDF, PNG, JPG
        </Typography>

        <input
          type="file"
          ref={inputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
          id="file-input"
          accept=".pdf, .png, .jpg, .jpeg"
        />

        <label htmlFor="file-input">
          <Button 
            variant="contained" 
            component="span" 
            size="large"
            disabled={uploading}
          >
            Choose File
          </Button>
        </label>
      </Paper>

      {file && (
        <Paper variant="outlined" sx={{ mt: 3, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
           <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
             <InsertDriveFile color="action" />
             <Box>
               <Typography variant="subtitle2" fontWeight={600}>{file.name}</Typography>
               <Typography variant="caption" color="text.secondary">{(file.size / 1024).toFixed(2)} KB</Typography>
             </Box>
           </Box>
           {!uploading && (
             <IconButton onClick={clearFile} color="error">
               <Delete />
             </IconButton>
           )}
        </Paper>
      )}

      {file && (
        <Box sx={{ mt: 3 }}>
          <Button 
            variant="contained" 
            color="primary" 
            fullWidth 
            size="large"
            onClick={uploadHandler} 
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Start Upload'}
          </Button>

          {uploading && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress variant="determinate" value={progress} />
              <Typography variant="caption" display="block" textAlign="right" sx={{ mt: 0.5 }}>
                {progress}%
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}