import { useEffect, useState, useCallback } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
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
  Chip
} from '@mui/material';
import { 
  Search, 
  FilterList, 
  CloudUpload,
  Clear,
  PictureAsPdf,
  Image as ImageIcon,
  Description,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { toast } from "react-toastify";

export default function Documents() {
  const [docs, setDocs] = useState([]);
  const [query, setQuery] = useState("");
  const [vendors, setVendors] = useState([]);
  const [vendorFilter, setVendorFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Applied filter values
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
    e.preventDefault(); // Prevent navigation to details
    e.stopPropagation();
    
    if (window.confirm("Are you sure you want to delete this document? This action cannot be undone.")) {
      try {
        await API.delete(`/documents/${id}`);
        toast.success("Document deleted successfully");
        // Refresh the list
        loadDocs();
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to delete document");
      }
    }
  };

  const getFileIcon = (type) => {
    if (type?.includes('pdf')) return <PictureAsPdf color="error" fontSize="small" />;
    if (type?.includes('image')) return <ImageIcon color="primary" fontSize="small" />;
    return <Description color="action" fontSize="small" />;
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>Documents</Typography>
          <Typography variant="body2" color="text.secondary">Manage and view your uploaded invoices</Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<CloudUpload />} 
          component={Link} 
          to="/upload"
          sx={{ px: 3 }}
        >
          Upload Invoice
        </Button>
      </Stack>

      {/* Filters */}
      <Paper elevation={0} variant="outlined" sx={{ p: 3, mb: 3, bgcolor: 'background.paper' }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <FilterList fontSize="small" color="action" />
          <Typography variant="subtitle2" fontWeight={600}>Filters</Typography>
        </Stack>
        
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField 
              fullWidth 
              size="small"
              label="Search" 
              placeholder="Search by vendor, invoice #" 
              value={query} 
              onChange={(e) => setQuery(e.target.value)} 
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Vendor</InputLabel>
              <Select value={vendorFilter} label="Vendor" onChange={(e) => setVendorFilter(e.target.value)}>
                <MenuItem value=""><em>All vendors</em></MenuItem>
                {vendors.map((v) => (
                  <MenuItem key={v} value={v}>{v}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6} md={2}>
            <TextField 
              label="From Date" 
              type="date" 
              size="small"
              fullWidth 
              InputLabelProps={{ shrink: true }} 
              value={fromDate} 
              onChange={(e) => setFromDate(e.target.value)} 
            />
          </Grid>

          <Grid item xs={6} md={2}>
            <TextField 
              label="To Date" 
              type="date" 
              size="small"
              fullWidth 
              InputLabelProps={{ shrink: true }} 
              value={toDate} 
              onChange={(e) => setToDate(e.target.value)} 
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <Stack direction="row" spacing={1}>
              <Button variant="contained" onClick={handleApply} fullWidth sx={{ height: 40 }}>
                Apply
              </Button>
              <Button variant="outlined" onClick={handleClear} sx={{ height: 40, minWidth: 40, p: 0 }}>
                <Clear fontSize="small" />
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Table */}
      <TableContainer component={Paper} elevation={0} variant="outlined">
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>File / Invoice</TableCell>
              <TableCell>Vendor</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Invoice Date</TableCell>
              <TableCell>Uploaded</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {docs.length > 0 ? (
              docs.map((d) => (
                <TableRow 
                  key={d._id} 
                  hover 
                  component={Link} 
                  to={`/documents/${d._id}`} 
                  sx={{ textDecoration: 'none', cursor: 'pointer', '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      {getFileIcon(d.fileType)}
                      <Box>
                         <Typography variant="body2" fontWeight={600} color="text.primary">
                           {d.extractedData?.invoiceNumber || "—"}
                         </Typography>
                         <Typography variant="caption" color="text.secondary">
                           {d.fileName}
                         </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    {d.extractedData?.vendorName ? (
                      <Chip label={d.extractedData.vendorName} size="small" variant="outlined" />
                    ) : (
                      <Typography variant="body2" color="text.secondary">—</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={600} color={d.extractedData?.totalAmount ? 'success.main' : 'text.disabled'}>
                       {d.extractedData?.totalAmount ? `$ ${d.extractedData.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 5 })}` : '—'}
                    </Typography>
                  </TableCell>
                  <TableCell>{d.extractedData?.invoiceDate || '—'}</TableCell>
                  <TableCell>
                    {new Date(d.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton 
                      onClick={(e) => handleDelete(e, d._id)} 
                      color="error" 
                      size="small"
                      title="Delete Document"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <Typography color="text.secondary">No documents found matching your filters.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination 
          count={Math.max(1, Math.ceil(totalCount / limit))} 
          page={page} 
          onChange={(_, p) => setPage(p)} 
          color="primary" 
          shape="rounded"
        />
      </Box>
    </Box>
  );
}