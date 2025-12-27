import { useEffect, useState, useCallback } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';

export default function Documents() {
  const [docs, setDocs] = useState([]);
  const [query, setQuery] = useState("");
  const [vendors, setVendors] = useState([]);
  const [vendorFilter, setVendorFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Applied filter values (only updated when user clicks Apply)
  const [appliedQuery, setAppliedQuery] = useState("");
  const [appliedVendor, setAppliedVendor] = useState("");
  const [appliedFromDate, setAppliedFromDate] = useState("");
  const [appliedToDate, setAppliedToDate] = useState("");

  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalCount, setTotalCount] = useState(0);

  // loadDocs uses the currently-applied filters and current page
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

  // load vendors once on mount
  useEffect(() => {
    API.get("/documents/vendors").then((res) => setVendors(res.data));
  }, []);

  // auto-load when applied filters or page change
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

  return (
    <div>
      <Typography variant="h4" gutterBottom>Uploaded Documents</Typography>

      <Grid container spacing={2} alignItems="center" style={{ marginBottom: 12 }}>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Search" placeholder="Search by vendor, invoice, or filename" value={query} onChange={(e) => setQuery(e.target.value)} />
        </Grid>

        <Grid item xs={6} md={2}>
          <FormControl fullWidth>
            <InputLabel>Vendor</InputLabel>
            <Select value={vendorFilter} label="Vendor" onChange={(e) => setVendorFilter(e.target.value)}>
              <MenuItem value="">All vendors</MenuItem>
              {vendors.map((v) => (
                <MenuItem key={v} value={v}>{v}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={6} md={2}>
          <TextField label="From" type="date" fullWidth InputLabelProps={{ shrink: true }} value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        </Grid>

        <Grid item xs={6} md={2}>
          <TextField label="To" type="date" fullWidth InputLabelProps={{ shrink: true }} value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </Grid>

        <Grid item xs={12} md={12}>
          <Button variant="contained" color="primary" onClick={handleApply}>Apply</Button>
          <Button variant="outlined" style={{ marginLeft: 8 }} component={Link} to="/upload">Upload Invoice</Button>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Invoice / File</TableCell>
              <TableCell>Vendor</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {docs.map((d) => (
              <TableRow key={d._id} hover component={Link} to={`/documents/${d._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <TableCell>{d.extractedData?.invoiceNumber || d.fileName}</TableCell>
                <TableCell>{d.extractedData?.vendorName || '-'}</TableCell>
                <TableCell>{d.extractedData?.totalAmount ?? '-'}</TableCell>
                <TableCell>{d.extractedData?.invoiceDate || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
        <Pagination count={Math.max(1, Math.ceil(totalCount / limit))} page={page} onChange={(_, p) => setPage(p)} color="primary" />
      </div>
    </div>
  );
}
