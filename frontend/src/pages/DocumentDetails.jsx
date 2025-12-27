import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";
import { 
  Button, 
  Typography, 
  Paper, 
  Box, 
  Grid, 
  Stack,
  CircularProgress,
  TextField,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  ArrowBack, 
  Save, 
  Download, 
  ReceiptLong,
  CalendarToday, 
  AttachMoney, 
  Store,
  Description
} from '@mui/icons-material';

export default function DocumentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [saving, setSaving] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    vendorName: "",
    invoiceNumber: "",
    invoiceDate: "",
    totalAmount: ""
  });

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const res = await API.get(`/documents/${id}`);
        setDoc(res.data);
        
        // Initialize form with extracted data
        const data = res.data.extractedData || {};
        setFormData({
          vendorName: data.vendorName || "",
          invoiceNumber: data.invoiceNumber || "",
          invoiceDate: data.invoiceDate || "",
          totalAmount: data.totalAmount || ""
        });

        // Fetch Blob for display
        const blobRes = await API.get(`/documents/${id}/download`, { responseType: 'blob' });
        const contentType = blobRes.headers['content-type'] || 'application/pdf';
        const url = window.URL.createObjectURL(new Blob([blobRes.data], { type: contentType }));
        setPdfUrl(url);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load document");
      } finally {
        setLoading(false);
      }
    };

    fetchDoc();

    // Cleanup Blob URL
    return () => {
      if (pdfUrl) window.URL.revokeObjectURL(pdfUrl);
    };
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await API.put(`/documents/${id}`, { extractedData: formData });
      toast.success("Document updated successfully");
      
      // Update local doc state
      setDoc(prev => ({ ...prev, extractedData: formData }));
    } catch (err) {
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const downloadOriginal = () => {
    if (pdfUrl) {
      const a = document.createElement('a');
      a.href = pdfUrl;
      a.download = doc.fileName || 'document.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  if (!doc) return <Typography color="error">Document not found</Typography>;

  return (
    <Box sx={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
      {/* Header Toolbar */}
      <Paper 
        elevation={1} 
        sx={{ 
          p: 2, 
          mb: 2, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderRadius: 2
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant="h6" fontWeight={700} lineHeight={1.2}>
              {doc.fileName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
               Interactive Verification Mode
            </Typography>
          </Box>
        </Stack>
        <Stack direction="row" spacing={2}>
           <Button 
            startIcon={<Download />} 
            onClick={downloadOriginal}
            color="inherit"
          >
            Download
          </Button>
          <Button 
            variant="contained" 
            startIcon={<Save />} 
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </Stack>
      </Paper>

      {/* Split View */}
      <Grid container spacing={2} sx={{ flexGrow: 1, overflow: 'hidden' }}>
        
        {/* Left Pane: PDF Viewer */}
        <Grid size={{ xs: 12, md: 7 }} sx={{ height: '100%' }}>
          <Paper 
            variant="outlined" 
            sx={{ 
              height: '100%', 
              bgcolor: 'grey.100', 
              overflow: 'hidden',
              borderRadius: 2,
              border: '1px solid #e0e0e0'
            }}
          >
            {pdfUrl ? (
              <iframe 
                src={pdfUrl} 
                width="100%" 
                height="100%" 
                style={{ border: 'none' }} 
                title="PDF Viewer"
              />
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Typography color="text.secondary">Loading PDF...</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Right Pane: Edit Form */}
        <Grid size={{ xs: 12, md: 5 }} sx={{ height: '100%', overflowY: 'auto' }}>
          <Paper sx={{ p: 3, height: '100%', borderRadius: 2 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <ReceiptLong color="primary" /> Verify & Edit Data
            </Typography>

            <Stack spacing={3}>
              <TextField
                label="Vendor Name"
                name="vendorName"
                value={formData.vendorName}
                onChange={handleChange}
                fullWidth
                InputProps={{
                  startAdornment: <Store color="action" sx={{ mr: 1 }} />
                }}
              />

              <TextField
                label="Invoice Number"
                name="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={handleChange}
                fullWidth
                InputProps={{
                  startAdornment: <Description color="action" sx={{ mr: 1 }} />
                }}
              />

              <TextField
                label="Invoice Date"
                name="invoiceDate"
                value={formData.invoiceDate}
                onChange={handleChange}
                fullWidth
                placeholder="YYYY-MM-DD"
                InputProps={{
                  startAdornment: <CalendarToday color="action" sx={{ mr: 1 }} />
                }}
              />

              <TextField
                label="Total Amount"
                name="totalAmount"
                value={formData.totalAmount}
                onChange={handleChange}
                fullWidth
                type="number"
                InputProps={{
                  startAdornment: <AttachMoney color="action" sx={{ mr: 1 }} />
                }}
              />

              <Box sx={{ mt: 2 }}>
                 <Typography variant="subtitle2" gutterBottom color="text.secondary">
                   Raw Text Preview
                 </Typography>
                 <Paper 
                   variant="outlined" 
                   sx={{ 
                     p: 2, 
                     bgcolor: 'grey.50', 
                     maxHeight: 200, 
                     overflow: 'auto',
                     fontSize: '0.8rem',
                     fontFamily: 'monospace'
                   }}
                 >
                   {doc.rawText}
                 </Paper>
              </Box>
            </Stack>
          </Paper>
        </Grid>

      </Grid>
    </Box>
  );
}
