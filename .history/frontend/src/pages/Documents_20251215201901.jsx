import { useEffect, useState } from "react";
import API from "../services/api";

export default function Documents() {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    API.get("/documents").then((res) => setDocs(res.data));
  }, []);

  return (
    <div>
      <h2>Uploaded Documents</h2>
      {docs.map((d) => (
        <div key={d._id}>
          <p>Invoice: {d.extractedData.invoiceNumber}</p>
          <p>Vendor: {d.extractedData.vendorName}</p>
          <p>Total: {d.extractedData.totalAmount}</p>
        </div>
      ))}
    </div>
  );
}
