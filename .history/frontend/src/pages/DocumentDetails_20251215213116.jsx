import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function DocumentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doc, setDoc] = useState(null);

  useEffect(() => {
    API.get(`/documents/${id}`).then((res) => setDoc(res.data)).catch(() => setDoc(null));
  }, [id]);

  if (!doc) return <div>Loading...</div>;

  return (
    <div>
      <button onClick={() => navigate(-1)}>Back</button>
      <h2>{doc.fileName}</h2>
      <p>Uploaded: {new Date(doc.createdAt).toLocaleString()}</p>
      <p>Type: {doc.fileType}</p>

      <h3>Extracted Data</h3>
      <pre>{JSON.stringify(doc.extractedData, null, 2)}</pre>

      <h3>Raw Text</h3>
      <pre style={{ whiteSpace: "pre-wrap", maxHeight: 400, overflow: "auto" }}>
        {doc.rawText}
      </pre>
    </div>
  );
}
