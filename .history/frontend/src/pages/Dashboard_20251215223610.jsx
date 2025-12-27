import { useEffect, useState } from "react";
import API from "../services/api";
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

export default function Dashboard() {
  const [total, setTotal] = useState(0);
  const [count, setCount] = useState(0);
  const [topVendors, setTopVendors] = useState([]);

  useEffect(() => {
    API.get("/documents")
      .then((res) => {
        const docs = res.data.docs || res.data;
        setCount(docs.length);
        const sum = docs.reduce((acc, d) => acc + (Number(d?.extractedData?.totalAmount) || 0), 0);
        setTotal(sum);

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
      <Typography variant="h4" gutterBottom>Dashboard</Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>Total Documents</Typography>
              <Typography variant="h5">{count}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>Total Revenue</Typography>
              <Typography variant="h5">₹{total.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>Top Vendors</Typography>
              <List>
                {topVendors.map(([name, amt]) => (
                  <ListItem key={name} disablePadding>
                    <ListItemText primary={`${name} — ₹${amt.toFixed(2)}`} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

