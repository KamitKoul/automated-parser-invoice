import { useEffect, useState } from "react";
import API from "../services/api";

export default function Dashboard() {
  const [total, setTotal] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    API.get("/documents").then((res) => {
      setCount(res.data.length);
      const sum = res.data.reduce(
        (acc, d) => acc + (d.extractedData.totalAmount || 0),
        0
      );
      setTotal(sum);
    });
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Total Documents: {count}</p>
      <p>Total Revenue: ₹{total}</p>
    </div>
  );
}
