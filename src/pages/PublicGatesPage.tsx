import { useEffect, useState } from "react";
import { Container, Paper, Typography, Button, Stack, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { type Gate, listGatesPublicApi } from "../api/gates.api";

export default function PublicVehiclesPage() {
  const [items, setItems] = useState<Gate[]>([]);
  const [error, setError] = useState("");
 
  const load = async () => {
    try {
      setError("");
      const data = await listGatesPublicApi();
      setItems(data.results); // DRF paginado
    } catch {
      setError("No se pudo cargar la lista pública. ¿Backend encendido?");
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Stack direction="row" sx={{ mb: 2 }}>
          <Typography variant="h5">Lista de Puertas de embarque (Público)</Typography>
          <Button variant="outlined" onClick={load}>Refrescar</Button>
        </Stack>

        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Terminal</TableCell>
              <TableCell>Diponible</TableCell>
              <TableCell>Creado en</TableCell>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}