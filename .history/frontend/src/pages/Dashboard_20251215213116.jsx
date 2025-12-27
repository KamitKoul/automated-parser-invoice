import { useEffect, useState } from "react";
import API from "../services/api";

export default function Dashboard() {
  const [total, setTotal] = useState(0);
  const [count, setCount] = useState(0);
  const [topVendors, setTopVendors] = useState([]);

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  useEffect(() => {
    API.get("/documents")
      .then((res) => {
        setCount(res.data.length);
        const docs = res.data;
        const sum = docs.reduce(
          (acc, d) => acc + (Number(d?.extractedData?.totalAmount) || 0),
          0
        );
        setTotal(sum);

        // top vendors
        const vendors = docs.reduce((acc, d) => {
          const name = d?.extractedData?.vendorName || "Unknown";
          acc[name] = (acc[name] || 0) + (Number(d?.extractedData?.totalAmount) || 0);
          return acc;
        }, {});
        setTopVendors(Object.entries(vendors).sort((a, b) => b[1] - a[1]).slice(0, 5));
      })
      .catch(() => {
        setCount(0);
        setTotal(0);
        setTopVendors([]);
      });
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Total Documents: {count}</p>
      <p>Total Revenue: ₹{total.toFixed(2)}</p>
      <h3>Top Vendors</h3>
      <ul>
        {topVendors.map(([name, amt]) => (
          <li key={name}>{name}: ₹{amt.toFixed(2)}</li>
        ))}
      </ul>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

