import { useEffect, useState } from "react";
import API from "../services/api";
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Paper,
  LinearProgress,
  Avatar,
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
        
        const sortedVendors = Object.entries(vendors)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5);
        
        setTopVendors(sortedVendors);
      })
      .catch(() => {
        setCount(0);
        setTotal(0);
        setTopVendors([]);
      });
  }, []);

  const maxVendorAmount = topVendors.length > 0 ? topVendors[0][1] : 0;

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
            value={`$ ${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
            icon={<AttachMoneyOutlined fontSize="large" />} 
            color="success"
            subtext="Total captured amount"
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ height: '100%', p: 3 }}>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
               <StorefrontTwoTone color="secondary" />
               <Typography variant="h6" fontWeight={600}>Top Vendors by Spending</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {topVendors.length > 0 ? (
                topVendors.map(([name, amt]) => (
                  <Box key={name}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" fontWeight={600}>{name}</Typography>
                      <Typography variant="body2" color="primary.main" fontWeight={700}>
                        $ {amt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={(amt / maxVendorAmount) * 100} 
                      sx={{ height: 8, borderRadius: 4 }}
                      color="secondary"
                    />
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">No data available</Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}