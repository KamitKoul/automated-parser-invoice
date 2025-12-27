import { useEffect, useState, useCallback } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

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

  const filtered = docs; // filtering moved to server-side

  return (
    <div>
      <h2>Uploaded Documents</h2>

      <Link to="/upload" style={{ marginLeft: 8 }}>
        <button>Upload Invoice</button>
      </Link>

      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <input
          placeholder="Search by vendor, invoice, or filename"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <select value={vendorFilter} onChange={(e) => setVendorFilter(e.target.value)}>
          <option value="">All vendors</option>
          {vendors.map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>

        <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />

        <button onClick={() => { setPage(1); setAppliedQuery(query); setAppliedVendor(vendorFilter); setAppliedFromDate(fromDate); setAppliedToDate(toDate); }}>Apply</button>
      </div>

      {filtered.map((d) => (
        <div key={d._id} style={{ borderBottom: "1px solid #ddd", padding: 8 }}>
          <Link to={`/documents/${d._id}`}>
            <strong>{d.extractedData?.invoiceNumber || d.fileName}</strong>
          </Link>
          <div>Vendor: {d.extractedData?.vendorName || "-"}</div>
          <div>Total: {d.extractedData?.totalAmount ?? "-"}</div>
        </div>
      ))}

      <div style={{ marginTop: 12 }}>
        <button disabled={page <= 1} onClick={() => { setPage((p) => p - 1); }}>Prev</button>
        <span style={{ margin: '0 8px' }}>Page {page} / {Math.ceil(totalCount / limit) || 1}</span>
        <button disabled={page >= Math.ceil(totalCount / limit)} onClick={() => { setPage((p) => p + 1); }}>Next</button>
      </div>
    </div>
  );
}
