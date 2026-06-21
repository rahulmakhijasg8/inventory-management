import { useState, useEffect } from "react";
import {
  Typography, Alert, Paper, TextField, Button, Stack,
  Table, TableHead, TableBody, TableRow, TableCell, TableContainer, IconButton,
} from "@mui/material";
import client from "../api/client";

function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", sku: "", price: "", quantity: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    try { setProducts((await client.get("/products")).data); }
    catch { setError("Failed to load products"); }
    finally { setLoading(false); }
  };
  useEffect(() => { loadProducts(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await client.post("/products", {
        name: form.name, sku: form.sku,
        price: parseFloat(form.price), quantity: parseInt(form.quantity),
      });
      setForm({ name: "", sku: "", price: "", quantity: "" });
      loadProducts();
    } catch (err) { setError(err.response?.data?.detail || "Failed to create product"); }
  };

  const handleDelete = async (id) => {
    try { await client.delete(`/products/${id}`); loadProducts(); }
    catch { setError("Failed to delete product"); }
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <div>
      <Typography variant="h4" gutterBottom>Products</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ p: 2, mb: 3 }}>
        <form onSubmit={handleSubmit}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField label="Name" name="name" value={form.name} onChange={handleChange} required fullWidth />
            <TextField label="SKU" name="sku" value={form.sku} onChange={handleChange} required fullWidth />
            <TextField label="Price" name="price" type="number" value={form.price} onChange={handleChange} required fullWidth />
            <TextField label="Quantity" name="quantity" type="number" value={form.quantity} onChange={handleChange} required fullWidth />
            <Button type="submit" variant="contained">Add</Button>
          </Stack>
        </form>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell><TableCell>Name</TableCell><TableCell>SKU</TableCell>
              <TableCell>Price</TableCell><TableCell>Qty</TableCell><TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.id}</TableCell><TableCell>{p.name}</TableCell><TableCell>{p.sku}</TableCell>
                <TableCell>{p.price}</TableCell><TableCell>{p.quantity}</TableCell>
                <TableCell><Button color="error" size="small" onClick={() => handleDelete(p.id)}>Delete</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Products;