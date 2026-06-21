import { useState, useEffect } from "react";
import {
  Typography, Alert, Paper, TextField, Button, Stack, MenuItem, Chip,
  Table, TableHead, TableBody, TableRow, TableCell, TableContainer, IconButton,
} from "@mui/material";
import client from "../api/client";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [items, setItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadAll = async () => {
    try {
      const [o, c, p] = await Promise.all([
        client.get("/orders"), client.get("/customers"), client.get("/products"),
      ]);
      setOrders(o.data); setCustomers(c.data); setProducts(p.data);
    } catch { setError("Failed to load data"); }
    finally { setLoading(false); }
  };
  useEffect(() => { loadAll(); }, []);

  const addItem = () => {
    if (!selectedProduct || !quantity) return;
    setItems([...items, { product_id: parseInt(selectedProduct), quantity: parseInt(quantity) }]);
    setSelectedProduct(""); setQuantity("");
  };
  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!customerId || items.length === 0) { setError("Pick a customer and add at least one item"); return; }
    try {
      await client.post("/orders", { customer_id: parseInt(customerId), items });
      setCustomerId(""); setItems([]); loadAll();
    } catch (err) { setError(err.response?.data?.detail || "Failed to create order"); }
  };

  const handleDelete = async (id) => {
    try { await client.delete(`/orders/${id}`); loadAll(); }
    catch { setError("Failed to delete order"); }
  };

  const productName = (id) => products.find((p) => p.id === id)?.name || `#${id}`;
  const customerName = (id) => customers.find((c) => c.id === id)?.name || `#${id}`;

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <div>
      <Typography variant="h4" gutterBottom>Orders</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ p: 2, mb: 3 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField select label="Customer" value={customerId} onChange={(e) => setCustomerId(e.target.value)} fullWidth>
              {customers.map((c) => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
            </TextField>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField select label="Product" value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} fullWidth>
                {products.map((p) => <MenuItem key={p.id} value={p.id}>{p.name} (stock: {p.quantity})</MenuItem>)}
              </TextField>
              <TextField label="Qty" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} sx={{ width: { xs: "100%", sm: 120 } }} />
              <Button variant="outlined" onClick={addItem}>Add item</Button>
            </Stack>

            {items.length > 0 && (
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {items.map((it, i) => (
                  <Chip key={i} label={`${productName(it.product_id)} × ${it.quantity}`} onDelete={() => removeItem(i)} />
                ))}
              </Stack>
            )}

            <Button type="submit" variant="contained" sx={{ alignSelf: "flex-start" }}>Create Order</Button>
          </Stack>
        </form>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow><TableCell>ID</TableCell><TableCell>Customer</TableCell><TableCell>Items</TableCell><TableCell>Total</TableCell><TableCell /></TableRow>
          </TableHead>
          <TableBody>
            {orders.map((o) => (
              <TableRow key={o.id}>
                <TableCell>{o.id}</TableCell>
                <TableCell>{customerName(o.customer_id)}</TableCell>
                <TableCell>{o.items.map((it) => <div key={it.id}>{productName(it.product_id)} × {it.quantity}</div>)}</TableCell>
                <TableCell>{o.total_amount}</TableCell>
                <TableCell><Button color="error" size="small" onClick={() => handleDelete(o.id)}>Delete</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Orders;