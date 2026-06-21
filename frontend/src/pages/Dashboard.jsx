import { useState, useEffect } from "react";
import {
  Typography, Alert, Card, CardContent, Box,
  Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper,
} from "@mui/material";
import client from "../api/client";

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    client.get("/dashboard/summary").then((res) => setSummary(res.data)).catch(() => setError("Failed to load dashboard"));
  }, []);

  if (error) return <Alert severity="error">{error}</Alert>;
  if (!summary) return <Typography>Loading...</Typography>;

  const metrics = [
    { label: "Total Products", value: summary.total_products },
    { label: "Total Customers", value: summary.total_customers },
    { label: "Total Orders", value: summary.total_orders },
    { label: "Low Stock Products", value: summary.low_stock_count },
  ];

  if (summary.total_products === 0) return <Typography>No products in inventory</Typography>;

  return (
    <div>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" }, gap: 2, mb: 4 }}>
        {metrics.map((m) => (
          <Card key={m.label}>
            <CardContent>
              <Typography variant="h4">{m.value}</Typography>
              <Typography color="text.secondary">{m.label}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Typography variant="h5" gutterBottom>Low Stock</Typography>
      {summary.low_stock_products.length === 0 ? (
        <Typography>All product are well stocked.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow><TableCell>Name</TableCell><TableCell>SKU</TableCell><TableCell>Quantity</TableCell></TableRow>
            </TableHead>
            <TableBody>
              {summary.low_stock_products.map((p) => (
                <TableRow key={p.id}><TableCell>{p.name}</TableCell><TableCell>{p.sku}</TableCell><TableCell>{p.quantity}</TableCell></TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}

export default Dashboard;