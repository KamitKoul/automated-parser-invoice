import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

export default function DocumentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doc, setDoc] = useState(null);

  useEffect(() => {
    API.get(`/documents/${id}`).then((res) => setDoc(res.data)).catch(() => setDoc(null));
  }, [id]);

  if (!doc) return <div>Loading...</div>;

  const download = async () => {
    try {
      const res = await API.get(`/documents/${id}/download`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.fileName || 'document';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed', err);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Button variant="outlined" onClick={() => navigate(-1)}>Back</Button>
        <Button variant="contained" color="primary" onClick={download} sx={{ ml: 2 }}>Download Original</Button>
      </Box>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h5">{doc.fileName}</Typography>
          <Typography color="text.secondary">Uploaded: {new Date(doc.createdAt).toLocaleString()}</Typography>
          <Typography color="text.secondary">Type: {doc.fileType}</Typography>
        </CardContent>
      </Card>

      <Typography variant="h6">Extracted Data</Typography>
      <Paper sx={{ p: 2, mb: 2 }}>
        <pre style={{ margin: 0 }}>{JSON.stringify(doc.extractedData, null, 2)}</pre>
      </Paper>

      <Typography variant="h6">Raw Text</Typography>
      <Paper sx={{ p: 2, maxHeight: 400, overflow: 'auto', whiteSpace: 'pre-wrap' }}>
        {doc.rawText}
      </Paper>
    </Box>
  );
}
