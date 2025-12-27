import { useEffect, useState } from "react";
import API from "../services/api";
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar,
  Avatar,
  Box,
  Divider,
  Paper
} from '@mui/material';
import { 
  DescriptionOutlined, 
  AttachMoneyOutlined, 
  StorefrontTwoTone,
  TrendingUp
} from '@mui/icons-material';

const StatCard = ({ title, value, icon, color, subtext }) => (
  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography color="text.secondary" gutterBottom variant="subtitle2" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, my: 1 }}>
            {value}
          </Typography>
          {subtext && (
             <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
               <TrendingUp fontSize="small" /> {subtext}
             </Typography>
          )}
        </Box>
        <Avatar sx={{ bgcolor: `${color}.light`, color: `${color}.main`, width: 56, height: 56 }}>
          {icon}
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

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
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
          Dashboard Overview
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Summary of your uploaded invoices and expenses.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard 
            title="Total Documents" 
            value={count} 
            icon={<DescriptionOutlined fontSize="large" />} 
            color="primary"
            subtext="Processed successfully"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard 
            title="Total Expenses" 
            value={`$ ${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 5 })}`} 
            icon={<AttachMoneyOutlined fontSize="large" />} 
            color="success"
            subtext="Total captured amount"
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ height: '100%', p: 0, overflow: 'hidden' }}>
            <Box sx={{ p: 2, bgcolor: 'background.default', borderBottom: 1, borderColor: 'divider' }}>
               <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                 <StorefrontTwoTone color="secondary" /> Top Vendors
               </Typography>
            </Box>
            <List sx={{ p: 0 }}>
              {topVendors.length > 0 ? (
                topVendors.map(([name, amt], index) => (
                  <Box key={name}>
                    <ListItem sx={{ py: 2 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'secondary.light', color: 'secondary.contrastText', fontWeight: 'bold' }}>
                          {name.charAt(0).toUpperCase()}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary={<Typography variant="subtitle1" fontWeight={600}>{name}</Typography>}
                        secondary="Vendor"
                      />
                      <Typography variant="body1" fontWeight={600} color="primary.main">
                        $ {amt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 5 })}
                      </Typography>
                    </ListItem>
                    {index < topVendors.length - 1 && <Divider variant="inset" component="li" />}
                  </Box>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="No data available" />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}