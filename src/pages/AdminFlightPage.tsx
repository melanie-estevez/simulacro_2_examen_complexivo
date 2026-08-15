import { useEffect, useState } from "react";
import {
  Container, Paper, Typography, TextField, Button, Stack,
  Table, TableHead, TableRow, TableCell, TableBody, IconButton, Alert,
  FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { type Gate, listGatesAdminApi } from "../api/gates.api";
import { type Flight, listFlightsAdminApi, createFlightApi, updateFlightApi, deleteFlightApi } from "../api/flights.api";

export default function AdminFlightsPage() {
  const [items, setItems] = useState<Flight[]>([]);
  const [gates, setGates] = useState<Gate[]>([]);
  const [error, setError] = useState("");

  const [editId, setEditId] = useState<number | null>(null);
  const [gate, setGate] = useState<number>(0);
  const [flight_number, setFlightNumber] = useState("");
  const [destination, setDestination] = useState("");
  const [status, setStatus] = useState("programado");

  const load = async () => {
    try {
      setError("");
      const data = await listFlightsAdminApi();
      setItems(data.results); // DRF paginado
    } catch {
      setError("No se pudo cargar el vuelo. ¿Login? ¿Token admin?");
    }
  };

  const loadGates = async () => {
    try {
      const data = await listGatesAdminApi();
      setGates(data.results); // DRF paginado
      if (!gate && data.results.length > 0) setGate(data.results[0].id);
    } catch {
      // si falla, no bloquea la pantalla
    }
  };

  useEffect(() => { load(); loadGates(); }, []);

  const save = async () => {
    try {
      setError("");
      if (!gate) return setError("Seleccione una puerta de embarque");
      

      const payload = {
        gate: Number(gate),
        flight_number:flight_number.trim(),
        destination: destination.trim(),
        status: status,
      };

      if (editId) await updateFlightApi(editId, payload);
      else await createFlightApi(payload as any);

      setEditId(null);
      setFlightNumber("");
      setDestination("");
      setStatus("programado");
      await load();
    } catch {
      setError("No se pudo guardar vehículo. ¿Token admin?");
    }
  };

  const startEdit = (f: Flight) => {
    setEditId(f.id);
    setGate(f.gate);
    setFlightNumber(f.flight_number);
    setDestination(f.destination);
    setStatus(f.status);
  };

  const remove = async (id: number) => {
    try {
      setError("");
      await deleteFlightApi(id);
      await load();
    } catch {
      setError("No se pudo eliminar el vuelo. ¿Token admin?");
    }
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Admin Vehículos (Privado)</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Stack spacing={2} sx={{ mb: 2 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>

            <FormControl sx={{ width: 260 }}>
              <InputLabel id="gate-label">Puerta de Embarque</InputLabel>
              <Select
                labelId="gate-label"
                label="Puerta de Embarque"
                value={gate}
                onChange={(e) => setGate(Number(e.target.value))}
              >
                {gates.map((g) => (
                  <MenuItem key={g.id} value={g.id}>
                    {g.code} - {g.terminal}(#{g.id})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField label="Numero de vuelo" value={flight_number} onChange={(e) => setFlightNumber(e.target.value)} fullWidth />
            <TextField label="Destino" value={destination} onChange={(e) => setDestination(e.target.value)} fullWidth />
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <FormControl sx={{ width: 260 }}>
                <InputLabel id="status-label">Estado</InputLabel>
                <Select
                    labelId="status-label"
                    label="Estado"
                    value={status}
                    onChange={(e) => setStatus(String(e.target.value))}
                >
                    <MenuItem value="programado">Programado</MenuItem>
                    <MenuItem value="embarque">En Embarque</MenuItem>
                    <MenuItem value="salida">Salida</MenuItem>
                    <MenuItem value="retrasado">Retrasado</MenuItem>
                    <MenuItem value="cancelado">Cancelado</MenuItem>
                </Select>
            </FormControl>


            <Button variant="contained" onClick={save}>{editId ? "Actualizar" : "Crear"}</Button>
            <Button variant="outlined" onClick={() => { setEditId(null); setFlightNumber(""); setDestination(""); setStatus(""); }}>Limpiar</Button>
            <Button variant="outlined" onClick={() => { load(); loadGates(); }}>Refrescar</Button>
          </Stack>
        </Stack>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Puerta de Embarque</TableCell>
              <TableCell>Numero de vuelo</TableCell>
              <TableCell>Destino</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Tiempo de salida</TableCell>
              <TableCell>Creado </TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((f) => (
              <TableRow key={f.id}>
                <TableCell>{f.id}</TableCell>
                <TableCell>{f.gate}</TableCell>
                <TableCell>{f.flight_number}</TableCell>
                <TableCell>{f.destination}</TableCell>
                <TableCell>{f.status}</TableCell>
                <TableCell>{f.departure_time}</TableCell>
                <TableCell>{f.created_at}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => startEdit(f)}><EditIcon /></IconButton>
                  <IconButton onClick={() => remove(f.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}