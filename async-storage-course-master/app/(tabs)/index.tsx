import { useState, useEffect } from "react";
import { View, TextInput, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync("Registro-db");

type Row = {
  id: number;
  nombre: string;
};

export default function Home() {
  const [text, setText] = useState("");
  const [palabras, setPalabras] = useState<Row[]>([]);
  const [indexAEditar, setIndexAEditar] = useState<number | null>(null);
  const [textoAEditar, setTextoAEditar] = useState("");

  async function read(): Promise<Row[]> {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS Registro (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL
      );
    `);
    return await db.getAllAsync("SELECT * FROM Registro");
  }

  async function agregarPalabra() {
    if (text.trim() !== "") {
      await db.runAsync("INSERT INTO Registro (nombre) VALUES (?)", [text]);
      setPalabras(await read());
      setText("");
    }
  }

  async function editarItem() {
    if (indexAEditar !== null && textoAEditar.trim() !== "") {
      await db.runAsync("UPDATE Registro SET nombre = ? WHERE id = ?", [textoAEditar, indexAEditar]);
      setPalabras(await read());
      setIndexAEditar(null);
      setTextoAEditar("");
    }
  }

  async function removerElemento(id: number) {
    await db.runAsync("DELETE FROM Registro WHERE id = ?", [id]);
    setPalabras(await read());
  }

  async function eliminarTodo() {
    await db.runAsync("DELETE FROM Registro");
    setPalabras([]);
  }

  useEffect(() => {
    (async () => setPalabras(await read()))();
  }, []);

  return (
    <View style={styles.container}>
      {/* Agregar nueva palabra */}
      <View style={styles.inputContainer}>
        <TextInput style={styles.input} value={text} onChangeText={setText} placeholder="Ingresa informacion" />
        <TouchableOpacity style={[styles.button, styles.addButton]} onPress={agregarPalabra}>
          <Text style={styles.buttonText}>Agregar</Text>
        </TouchableOpacity>
      </View>
       {/* Título entre ambos bloques */}
      <Text style={styles.titulo}>Lista de Información</Text>

      {/* Lista de palabras */}
      <FlatList
        data={palabras}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {indexAEditar === item.id ? (
              <TextInput
                value={textoAEditar}
                onChangeText={setTextoAEditar}
                placeholder="Editar texto"
                style={styles.input}
              />
            ) : (
              <Text style={styles.text}>{item.nombre}</Text>
            )}
            <View style={styles.buttonContainer}>
              {indexAEditar === item.id ? (
                <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={editarItem}>
                  <Text style={styles.buttonText}>Guardar</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.button, styles.editButton]}
                  onPress={() => {
                    setIndexAEditar(item.id);
                    setTextoAEditar(item.nombre);
                  }}
                >
                  <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => removerElemento(item.id)}>
                <Text style={styles.buttonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Botón de eliminar todo */}
      {palabras.length > 0 && (
        <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={eliminarTodo}>
          <Text style={styles.buttonText}>Eliminar todo los datos</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// 🎨 Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F2DF7C",
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  text: {
    fontSize: 18,
    color: "#770808",
    flex: 1,
  },
  input: {
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: "121dff",
    flex: 1,
    paddingVertical: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between",
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  addButton: {
    backgroundColor: "#cbc61a",
  },
  saveButton: {
    backgroundColor: "#4282ce",
  },
  editButton: {
    backgroundColor: "#7B5BF2",
  },
  deleteButton: {
    backgroundColor: "#c51a5d",
  },
  clearButton: {
    backgroundColor: "#7f2013",
    marginTop: 15,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center', // opcional, para centrar el texto
  },
}
);

