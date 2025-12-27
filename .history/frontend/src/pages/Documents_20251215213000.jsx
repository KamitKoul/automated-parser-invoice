import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

export default function Documents() {
  const [docs, setDocs] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    API.get("/documents").then((res) => setDocs(res.data));
  }, []);

  const filtered = docs.filter((d) => {
    const q = query.toLowerCase();
    return (
      d.extractedData?.vendorName?.toLowerCase().includes(q) ||
      d.extractedData?.invoiceNumber?.toLowerCase().includes(q) ||
      d.fileName?.toLowerCase().includes(q)
    );
  });

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
