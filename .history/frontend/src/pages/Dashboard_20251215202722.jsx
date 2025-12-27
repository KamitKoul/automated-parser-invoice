import { useEffect, useState } from "react";
import API from "../services/api";

export default function Dashboard() {
  const [total, setTotal] = useState(0);
  const [count, setCount] = useState(0);

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  useEffect(() => {
    API.get("/documents")
      .then((res) => {
        setCount(res.data.length);
        const sum = res.data.reduce(
          (acc, d) => acc + (Number(d?.extractedData?.totalAmount) || 0),
          0
        );
        setTotal(sum);
      })
      .catch(() => {
        setCount(0);
        setTotal(0);
      });
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Total Documents: {count}</p>
      <p>Total Revenue: ₹{total.toFixed(2)}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

