import { useState, useEffect } from "react";
import {
  Typography, Alert, Paper, TextField, Button, Stack,
  Table, TableHead, TableBody, TableRow, TableCell, TableContainer, IconButton,
} from "@mui/material";
import client from "../api/client";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadCustomers = async () => {
    try { setCustomers((await client.get("/customers")).data); }
    catch { setError("Failed to load customers"); }
    finally { setLoading(false); }
  };
  useEffect(() => { loadCustomers(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await client.post("/customers", form);
      setForm({ name: "", email: "", phone: "" });
      loadCustomers();
    } catch (err) { setError(err.response?.data?.detail || "Failed to create customer"); }
  };

  const handleDelete = async (id) => {
    try { await client.delete(`/customers/${id}`); loadCustomers(); }
    catch { setError("Failed to delete customer"); }
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <div>
      <Typography variant="h4" gutterBottom>Customers</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ p: 2, mb: 3 }}>
        <form onSubmit={handleSubmit}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField label="Full name" name="name" value={form.name} onChange={handleChange} required fullWidth />
            <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required fullWidth />
            <TextField label="Phone" name="phone" value={form.phone} onChange={handleChange} required fullWidth />
            <Button type="submit" variant="contained">Add</Button>
          </Stack>
        </form>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow><TableCell>ID</TableCell><TableCell>Name</TableCell><TableCell>Email</TableCell><TableCell>Phone</TableCell><TableCell /></TableRow>
          </TableHead>
          <TableBody>
            {customers.map((c) => (
              <TableRow key={c.id}>
                <TableCell>{c.id}</TableCell><TableCell>{c.name}</TableCell><TableCell>{c.email}</TableCell><TableCell>{c.phone}</TableCell>
                <TableCell><Button color="error" size="small" onClick={() => handleDelete(c.id)}>Delete</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Customers;