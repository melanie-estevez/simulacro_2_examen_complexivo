import { useEffect, useState } from "react";
import {
  Container, Paper, Typography, TextField, Button, Stack,
  Table, TableHead, TableRow, TableCell, TableBody, IconButton, Alert,
  FormControlLabel,
  Checkbox
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { type Gate, listGatesAdminApi, createGateApi, updateGateApi, deleteGateApi } from "../api/gates.api";

export default function AdminGatesPage() {
  const [items, setItems] = useState<Gate[]>([]);
  const [code, setCode] = useState("");
  const [terminal, setTerminal] = useState("");
  const [is_available, setIsAvailable] = useState(true);
  const [editId, setEditId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setError("");
      const data = await listGatesAdminApi();
      setItems(data.results); // DRF paginado
    } catch {
      setError("No se pudo cargar las puertas de embarque. ¿Login? ¿Token admin?");
    }
  };

  useEffect(() => { load(); }, []);

   const save = async () => {
    try {
      setError("");
      if (!code.trim()) return setError("Codigo requerid");
      if (!terminal.trim()) return setError("Terminal requerida");
      const payload = {
        code: code.trim(),
        terminal: terminal.trim(),
        is_available: is_available,
      };
      if (editId) await updateGateApi(editId, payload);
      else await createGateApi(payload);
      setCode("");
      setTerminal("");
      setIsAvailable(true);
      setEditId(null);
      await load();
    } catch {
      setError("No se pudo guardar vehiculo. ¿Token admin?");
    }
  };

  const startEdit = (g: Gate) => {
    setEditId(g.id);
    setCode(g.code);
    setTerminal(g.terminal);
    setIsAvailable(g.is_available);
  };

  const remove = async (id: number) => {
    try {
      setError("");
      await deleteGateApi(id);
      await load();
    } catch {
      setError("No se pudo eliminar.¿Token admin?");
    }
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Admin Gates (Privado)</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
          <TextField label="Codigo" value={code} onChange={(e) => setCode(e.target.value)} fullWidth />

          <TextField label="Terminal" value={terminal} onChange={(e) => setTerminal(e.target.value)} fullWidth />
          <FormControlLabel
            control={
              <Checkbox checked={is_available} onChange={(e) => setIsAvailable(e.target.checked)} />
            }
            label="Disponible"
          />
          <Button variant="contained" onClick={save}>{editId ? "Actualizar" : "Crear"}</Button>
          <Button variant="outlined" onClick={() => { setCode(""); setEditId(null); setTerminal(""), setIsAvailable(true)}}>Limpiar</Button>
          <Button variant="outlined" onClick={load}>Refrescar</Button>
        </Stack>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Codigo</TableCell>
              <TableCell>Terminal</TableCell>
              <TableCell>Disponible</TableCell>
              <TableCell>Creado en</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((g) => (
              <TableRow key={g.id}>
                <TableCell>{g.id}</TableCell>
                <TableCell>{g.code}</TableCell>
                <TableCell>{g.terminal}</TableCell>
                <TableCell>{g.is_available ? "Sí":"No"}</TableCell>
                <TableCell>{g.created_at}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => startEdit(g)}><EditIcon /></IconButton>
                  <IconButton onClick={() => remove(g.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}