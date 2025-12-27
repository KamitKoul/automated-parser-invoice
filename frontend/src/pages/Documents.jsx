import { useEffect, useState, useCallback } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { 
  Grid, 
  TextField, 
  Button, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Pagination, 
  Typography,
  Box,
  Stack,
  InputAdornment,
  IconButton,
  Chip,
  alpha
} from '@mui/material';
import { 
  Search, 
  FilterList, 
  CloudUpload,
  Clear,
  PictureAsPdf,
  Image as ImageIcon,
  Description,
  DeleteOutline
} from '@mui/icons-material';
import { toast } from "react-toastify";

export default function Documents() {
  const navigate = useNavigate();
  const [docs, setDocs] = useState([]);
  const [query, setQuery] = useState("");
  const [vendors, setVendors] = useState([]);
  const [vendorFilter, setVendorFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [appliedQuery, setAppliedQuery] = useState("");
  const [appliedVendor, setAppliedVendor] = useState("");
  const [appliedFromDate, setAppliedFromDate] = useState("");
  const [appliedToDate, setAppliedToDate] = useState("");

  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalCount, setTotalCount] = useState(0);

  const loadDocs = useCallback((opts = {}) => {
    const params = {
      search: opts.search ?? appliedQuery,
      vendor: opts.vendor ?? (appliedVendor || undefined),
      from: opts.from ?? (appliedFromDate || undefined),
      to: opts.to ?? (appliedToDate || undefined),
      page: opts.page ?? page,
      limit: limit
    };

    API.get("/documents", { params }).then((res) => {
      const data = res.data.docs || res.data;
      setDocs(data);
      setTotalCount(res.data.totalCount || data.length);
    });
  }, [appliedQuery, appliedVendor, appliedFromDate, appliedToDate, page, limit]);

  useEffect(() => {
    API.get("/documents/vendors").then((res) => setVendors(res.data));
  }, []);

  useEffect(() => {
    loadDocs();
  }, [loadDocs]);

  const handleApply = () => {
    setPage(1);
    setAppliedQuery(query);
    setAppliedVendor(vendorFilter);
    setAppliedFromDate(fromDate);
    setAppliedToDate(toDate);
  };

  const handleClear = () => {
    setQuery("");
    setVendorFilter("");
    setFromDate("");
    setToDate("");
    setAppliedQuery("");
    setAppliedVendor("");
    setAppliedFromDate("");
    setAppliedToDate("");
    setPage(1);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this document?")) {
      try {
        await API.delete(`/documents/${id}`);
        toast.success("Document deleted successfully");
        loadDocs();
      } catch (err) {
        toast.error("Failed to delete document");
      }
    }
  };

  const getFileIcon = (type) => {
    if (type?.includes('pdf')) return <PictureAsPdf sx={{ color: '#f43f5e' }} fontSize="small" />;
    if (type?.includes('image')) return <ImageIcon sx={{ color: '#3b82f6' }} fontSize="small" />;
    return <Description sx={{ color: '#64748b' }} fontSize="small" />;
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ color: 'text.primary', letterSpacing: '-0.02em' }}>
            Documents
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and verify your extracted invoice data.
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<CloudUpload />} 
          onClick={() => navigate("/upload")}
          size="large"
          sx={{ px: 4, borderRadius: 3, fontWeight: 700 }}
        >
          Upload New
        </Button>
      </Stack>

      {/* Filters Area */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 4, 
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper'
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField 
              fullWidth 
              size="small"
              placeholder="Search invoices..." 
              value={query} 
              onChange={(e) => setQuery(e.target.value)} 
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" color="disabled" />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 }
              }}
            />
          </Grid>

          <Grid size={{ xs: 6, md: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Vendor</InputLabel>
              <Select 
                value={vendorFilter} 
                label="Vendor" 
                onChange={(e) => setVendorFilter(e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value=""><em>All vendors</em></MenuItem>
                {vendors.map((v) => (
                  <MenuItem key={v} value={v}>{v}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 6, md: 2 }}>
            <TextField 
              label="From" 
              type="date" 
              size="small"
              fullWidth 
              InputLabelProps={{ shrink: true }} 
              value={fromDate} 
              onChange={(e) => setFromDate(e.target.value)} 
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Grid>

          <Grid size={{ xs: 6, md: 2 }}>
            <TextField 
              label="To" 
              type="date" 
              size="small"
              fullWidth 
              InputLabelProps={{ shrink: true }} 
              value={toDate} 
              onChange={(e) => setToDate(e.target.value)} 
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Stack direction="row" spacing={1}>
              <Button 
                variant="contained" 
                onClick={handleApply} 
                fullWidth 
                sx={{ borderRadius: 2, fontWeight: 600 }}
              >
                Apply Filters
              </Button>
              <Button 
                variant="outlined" 
                onClick={handleClear} 
                color="inherit"
                sx={{ borderRadius: 2, minWidth: 48 }}
              >
                <Clear fontSize="small" />
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Modern Table */}
      <TableContainer 
        component={Paper} 
        elevation={0} 
        sx={{ 
          borderRadius: 4, 
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden'
        }}
      >
        <Table>
          <TableHead sx={{ bgcolor: (theme) => theme.palette.mode === 'light' ? 'grey.50' : 'grey.900' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, py: 2 }}>Invoice Details</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Vendor</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, pr: 3 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {docs.length > 0 ? (
              docs.map((d) => (
                <TableRow 
                  key={d._id} 
                  hover 
                  onClick={() => navigate(`/documents/${d._id}`)}
                  sx={{ 
                    cursor: 'pointer',
                    '&:last-child td, &:last-child th': { border: 0 },
                    transition: 'background-color 0.2s'
                  }}
                >
                  <TableCell sx={{ py: 2.5 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box 
                        sx={{ 
                          p: 1, 
                          borderRadius: 2, 
                          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                          display: 'flex'
                        }}
                      >
                        {getFileIcon(d.fileType)}
                      </Box>
                      <Box>
                         <Typography variant="body2" fontWeight={700} color="text.primary">
                           {d.extractedData?.invoiceNumber || "Untagged"}
                         </Typography>
                         <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                           {d.fileName}
                         </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    {d.extractedData?.vendorName ? (
                      <Chip 
                        label={d.extractedData.vendorName} 
                        size="small" 
                        sx={{ fontWeight: 600, borderRadius: 1.5, bgcolor: 'background.default' }} 
                        variant="outlined" 
                      />
                    ) : (
                      <Typography variant="caption" color="text.disabled">Unknown</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={800} color="primary.main">
                       {d.extractedData?.totalAmount ? `$ ${d.extractedData.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '—'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {d.extractedData?.invoiceDate || '—'}
                    </Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ pr: 2 }}>
                    <Tooltip title="Delete">
                      <IconButton 
                        onClick={(e) => handleDelete(e, d._id)} 
                        sx={{ 
                          color: 'error.light',
                          '&:hover': { bgcolor: alpha('#ef4444', 0.1), color: 'error.main' }
                        }} 
                        size="small"
                      >
                        <DeleteOutline fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                  <Description sx={{ fontSize: 48, color: 'text.disabled', mb: 1, opacity: 0.5 }} />
                  <Typography color="text.secondary" fontWeight={500}>No documents found.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Pagination 
          count={Math.max(1, Math.ceil(totalCount / limit))} 
          page={page} 
          onChange={(_, p) => setPage(p)} 
          color="primary" 
          shape="rounded"
          size="large"
        />
      </Box>
    </Box>
  );
}