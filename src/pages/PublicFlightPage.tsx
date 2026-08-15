import { useEffect, useState } from "react";
import { Container, Paper, Typography, Button, Stack, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { type Flight, listFlightsPublicApi } from "../api/flights.api";

export default function PublicVehiclesPage() {
  const [items, setItems] = useState<Flight[]>([]);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setError("");
      const data = await listFlightsPublicApi();
      setItems(data.results); // DRF paginado
    } catch {
      setError("No se pudo cargar la lista pública. ¿Backend encendido?");
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Stack direction="row"  sx={{ mb: 2 }}>
          <Typography variant="h5">Lista de Vuelos (Público)</Typography>
          <Button variant="outlined" onClick={load}>Refrescar</Button>
        </Stack>

        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Puerta de Embarque</TableCell>
              <TableCell>Numero de vuelo</TableCell>
              <TableCell>Destino</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Tiempo de salida</TableCell>
              <TableCell>Creado en</TableCell>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}