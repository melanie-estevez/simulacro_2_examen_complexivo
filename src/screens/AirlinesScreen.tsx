import { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, FlatList, StyleSheet } from "react-native";

import { listAirlinesApi, createAirlineApi, deleteAirlineApi } from "../api/airlines.api";
import type { Airline } from "../types/airlines";
import { toArray } from "../types/drf";

function normalizeText(input: string): string {
  return input.trim();
}

export default function AirlineScreen() {
  const [items, setItems] = useState<Airline[]>([]);
  const [gate_id, setGateId] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [country, setCountry] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const load = async (): Promise<void> => {
    try {
      setErrorMessage("");
      const data = await listAirlinesApi();
      setItems(toArray(data));
    } catch {
      setErrorMessage("No se pudo cargar la aerolinea ¿Login? ¿Token?");
    }
  };

  useEffect(() => { load(); }, []);

   const createItem = async (): Promise<void> => {
    try {
      setErrorMessage("");

      if (!name) {
        return setErrorMessage("Nombre requerido");
      }

      if (!code.trim()) {
        return setErrorMessage("Codigo Requerido");
      }


      const created = await createAirlineApi({
        gate_id: Number(gate_id),
        name: name.trim(),
        code: code.trim(),
        country: country.trim(),
      });


      setItems((prev) => [created, ...prev]);

      setGateId("");
      setName("");
      setCode("");
      setCountry("");

    } catch {
      setErrorMessage("No se pudo crear la aerolinea.");
    }
  };

  const removeItem = async (id: string): Promise<void> => {
    try {
      setErrorMessage("");
      await deleteAirlineApi(id);
      setItems((prev) => prev.filter((it) => it.id !== id));
    } catch {
      setErrorMessage("No se pudo eliminar aerolinea.");
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        style={styles.list}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>Aerolineas Registradas</Text>
            {!!errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
            <Text style={styles.label}>Puerta de Embarque</Text>
            <TextInput
              value={gate_id}
              onChangeText={setGateId}
              placeholder="Puerta de Embarque"
              placeholderTextColor="#8b949e"
              style={styles.input}
            />
            <Text style={styles.label}>Nombre</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Nombre de Aerolinea"
              placeholderTextColor="#8b949e"
              style={styles.input}
            />

            <Text style={styles.label}>Codigo</Text>
            <TextInput
              value={code}
              onChangeText={setCode}
              placeholder="Codigo de Aerolinea"
              placeholderTextColor="#8b949e"
              style={styles.input}
            />

            <Text style={styles.label}>Pais</Text>
            <TextInput
              value={country}
              onChangeText={setCountry}
              placeholder="Pais"
              placeholderTextColor="#8b949e"
              style={styles.input}
            />


            <Pressable onPress={createItem} style={styles.btn}>
              <Text style={styles.btnText}>Crear</Text>
            </Pressable>

            <Pressable onPress={load} style={[styles.btn, { marginBottom: 12 }]}>
              <Text style={styles.btnText}>Refrescar</Text>
            </Pressable>
          </View>
        }
         renderItem={({ item }) => (

          <View style={styles.row}>

            <View style={{ flex: 1, marginRight: 10 }}>

              <Text style={styles.rowText}>
                Id de Puerta de Embarque: {item.gate_id}
              </Text>

              <Text style={styles.rowSub}>
                Codigo: {item.code}
              </Text>

              <Text style={styles.rowSub}>
                Country: {item.country}
              </Text>

              {!!item.created_at && (
                <Text style={styles.rowSub}>
                  Fecha: {item.created_at}
                </Text>
              )}

            </View>


            <Pressable
              onPress={() =>
                removeItem(item.id)
              }
            >
              <Text style={styles.del}>
                Eliminar
              </Text>
            </Pressable>

          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d1117", padding: 16 },
  title: { color: "#58a6ff", fontSize: 22, fontWeight: "800", marginBottom: 10 },
  error: { color: "#ff7b72", marginBottom: 10 },
  label: { color: "#8b949e", marginBottom: 6, marginTop: 6 },
  input: {
    backgroundColor: "#161b22",
    color: "#c9d1d9",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#30363d",
  },
  btn: { backgroundColor: "#21262d", borderColor: "#58a6ff", borderWidth: 1, padding: 12, borderRadius: 8 },
  btnText: { color: "#58a6ff", textAlign: "center", fontWeight: "700" },
  list: { flex: 1 },
  row: {
    backgroundColor: "#161b22",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#30363d",
  },
  rowText: { color: "#c9d1d9", fontWeight: "800" },
  rowSub: { color: "#8b949e", marginTop: 2 },
  del: { color: "#ff7b72", fontWeight: "700" },
});