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

  return (
    <div>
      <button onClick={() => navigate(-1)}>Back</button>
      <button onClick={download} style={{ marginLeft: 8 }}>Download Original</button>
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
