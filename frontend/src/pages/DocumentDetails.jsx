import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { 
  Button, 
  Typography, 
  Card, 
  CardContent, 
  Paper, 
  Box, 
  Grid, 
  Chip, 
  Divider,
  Stack,
  CircularProgress
} from '@mui/material';
import { 
  ArrowBack, 
  Download, 
  ReceiptLong, 
  Description, 
  CalendarToday, 
  AttachMoney, 
  Store 
} from '@mui/icons-material';

const DetailItem = ({ label, value, icon }) => (
  <Grid item xs={12} sm={6} md={4}>
    <Paper variant="outlined" sx={{ p: 2, height: '100%', borderColor: 'grey.200' }}>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <Box sx={{ color: 'primary.main', display: 'flex' }}>
          {icon}
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>
            {label}
          </Typography>
          <Typography variant="body1" fontWeight={600} sx={{ mt: 0.5 }}>
            {value || "—"}
          </Typography>
        </Box>
      </Box>
    </Paper>
  </Grid>
);

export default function DocumentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/documents/${id}`)
      .then((res) => setDoc(res.data))
      .catch(() => setDoc(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
  if (!doc) return <Typography color="error">Document not found</Typography>;

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

  const { extractedData } = doc;

  return (
    <Box>
      {/* Header Section */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 1, color: 'text.secondary' }}>
            Back to List
          </Button>
          <Typography variant="h4" fontWeight={700}>
            {doc.fileName}
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
             <Chip label={doc.fileType} size="small" variant="outlined" />
             <Typography variant="body2" color="text.secondary">
               Uploaded on {new Date(doc.createdAt).toLocaleString()}
             </Typography>
          </Stack>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<Download />} 
          onClick={download}
          size="large"
        >
          Download Original
        </Button>
      </Box>

      {/* Extracted Data Section */}
      <Typography variant="h5" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <ReceiptLong color="primary" /> Extracted Invoice Data
      </Typography>
      
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <DetailItem 
          label="Invoice Number" 
          value={extractedData?.invoiceNumber} 
          icon={<Description />}
        />
        <DetailItem 
          label="Vendor Name" 
          value={extractedData?.vendorName} 
          icon={<Store />}
        />
        <DetailItem 
          label="Invoice Date" 
          value={extractedData?.invoiceDate} 
          icon={<CalendarToday />}
        />
        <DetailItem 
          label="Total Amount" 
          value={extractedData?.totalAmount ? `$ ${extractedData.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 5 })}` : null} 
          icon={<AttachMoney />}
        />
      </Grid>

      <Divider sx={{ my: 4 }} />

      {/* Raw Text Section */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        Raw Extracted Text
      </Typography>
      <Paper variant="outlined" sx={{ p: 3, bgcolor: 'grey.50', maxHeight: 400, overflow: 'auto' }}>
        <Typography 
          component="pre" 
          sx={{ 
            fontFamily: 'monospace', 
            whiteSpace: 'pre-wrap', 
            fontSize: '0.875rem', 
            color: 'text.secondary',
            margin: 0
          }}
        >
          {doc.rawText || "No text extracted."}
        </Typography>
      </Paper>
    </Box>
  );
}
