import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

export default function Documents() {
  const [docs, setDocs] = useState([]);
  const [query, setQuery] = useState("");
  const [vendors, setVendors] = useState([]);
  const [vendorFilter, setVendorFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    // load vendors for filter
    API.get("/documents/vendors").then((res) => setVendors(res.data));
    loadDocs();
  }, []);

  const loadDocs = (opts = {}) => {
    const params = {
      search: query,
      vendor: opts.vendor || vendorFilter || undefined,
      from: opts.from || fromDate || undefined,
      to: opts.to || toDate || undefined,
      page: page,
      limit: limit
    };

    API.get("/documents", { params }).then((res) => {
      const data = res.data.docs || res.data;
      setDocs(data);
      setTotalCount(res.data.totalCount || data.length);
    });
  };

  const filtered = docs; // filtering moved to server-side

  return (
    <div>
      <h2>Uploaded Documents</h2>

      <input
        placeholder="Search by vendor, invoice, or filename"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {filtered.map((d) => (
        <div key={d._id} style={{ borderBottom: "1px solid #ddd", padding: 8 }}>
          <Link to={`/documents/${d._id}`}>
            <strong>{d.extractedData?.invoiceNumber || d.fileName}</strong>
          </Link>
          <div>Vendor: {d.extractedData?.vendorName || "-"}</div>
          <div>Total: {d.extractedData?.totalAmount ?? "-"}</div>
        </div>
      ))}
    </div>
  );
}
