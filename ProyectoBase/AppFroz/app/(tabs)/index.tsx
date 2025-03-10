import React, { useState } from 'react';
import { View, Text, Alert, FlatList, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import * as FileSystem from 'expo-file-system'; // Para trabajar con archivos en Expo
import RNHTMLtoPDF from 'react-native-html-to-pdf'; // Para generar el PDF

const API_URL = 'http://34.233.122.84/api/default/horarios';

export default function App() {
  const [currentNoControl, setCurrentNoControl] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [horarios, setHorarios] = useState([]);

  const handleLogin = async () => {
    if (!currentNoControl || !contraseña) {
      Alert.alert('Error', 'Por favor, ingrese ambos campos.');
      return;
    }

    try {
      // Codificar en Base64 las credenciales
      const credentials = `${currentNoControl}:${contraseña}`;
      const encodedCredentials = btoa(credentials);

      // Hacer la solicitud con autenticación básica
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${encodedCredentials}`,
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (response.ok) {
        // Extraemos los datos y los organizamos
        const organizedHorarios = data.map((item: any) => ({
          periodo: item.periodo,
          rfc: item.rfc,
          tipo_horario: item.tipo_horario,
          dia_semana: item.dia_semana,
          hora_inicial: item.hora_inicial, // Solo la hora, sin la fecha
          hora_final: item.hora_final,     // Solo la hora, sin la fecha
          materia: item.materia,  // Elimina espacios extra
          grupo: item.grupo,
          aula: item.aula,
        }));

        // Guardar los horarios en el estado
        setHorarios(organizedHorarios);

      } else {
        Alert.alert('Error', 'Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
      Alert.alert('Error', 'Ocurrió un error al intentar iniciar sesión.');
    }
  };

  const generatePDF = async () => {
    const htmlContent = `
      <h1>Horarios de Clases</h1>
      <table border="1">
        <thead>
          <tr>
            <th>Periodo</th>
            <th>RFC</th>
            <th>Tipo Horario</th>
            <th>Día</th>
            <th>Hora Inicio</th>
            <th>Hora Final</th>
            <th>Materia</th>
            <th>Grupo</th>
            <th>Aula</th>
          </tr>
        </thead>
        <tbody>
          ${horarios.map(item => `
            <tr>
              <td>${item.periodo}</td>
              <td>${item.rfc}</td>
              <td>${item.tipo_horario}</td>
              <td>${item.dia_semana}</td>
              <td>${item.hora_inicial}</td>
              <td>${item.hora_final}</td>
              <td>${item.materia}</td>
              <td>${item.grupo}</td>
              <td>${item.aula}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    try {
      const options = {
        html: htmlContent,
        fileName: 'horarios',
        directory: FileSystem.documentDirectory, // Usando directorio de Expo para guardar el archivo
      };

      const file = await RNHTMLtoPDF.convert(options);
      Alert.alert('PDF Generado', `El PDF ha sido guardado en: ${file.filePath}`);
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      Alert.alert('Error', 'Ocurrió un error al generar el PDF.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>📅 Horarios de Clases</Text>

      {/* Inputs */}
      <TextInput
        style={styles.input}
        placeholder="Número de control"
        value={currentNoControl}
        onChangeText={setCurrentNoControl}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={contraseña}
        onChangeText={setContraseña}
        secureTextEntry
      />

      {/* Botón de Login */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Cargar Horarios</Text>
      </TouchableOpacity>

      {/* Tabla de horarios */}
      <FlatList
        data={horarios}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={() => (
          <View style={styles.tableHeader}>
            <Text style={styles.headerText}>Periodo</Text>
            <Text style={styles.headerText}>rfc</Text>
            <Text style={styles.headerText}>Tipo Horario</Text>
            <Text style={styles.headerText}>Día</Text>
            <Text style={styles.headerText}>Hora Inicio</Text>
            <Text style={styles.headerText}>Hora Final</Text>
            <Text style={styles.headerText}>Materia</Text>
            <Text style={styles.headerText}>Grupo</Text>
            <Text style={styles.headerText}>Aula</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={styles.tableRow}>
            <Text style={styles.cell}>{item.periodo}</Text>
            <Text style={styles.cell}>{item.rfc}</Text>
            <Text style={styles.cell}>{item.tipo_horario}</Text>
            <Text style={styles.cell}>{item.dia_semana}</Text>
            <Text style={styles.cell}>{item.hora_inicial}</Text>
            <Text style={styles.cell}>{item.hora_final}</Text>
            <Text style={styles.cell}>{item.materia}</Text>
            <Text style={styles.cell}>{item.grupo}</Text>
            <Text style={styles.cell}>{item.aula}</Text>
          </View>
        )}
      />

      {/* Botón para generar PDF */}
      <TouchableOpacity style={styles.button} onPress={generatePDF}>
        <Text style={styles.buttonText}>Generar PDF</Text>
      </TouchableOpacity>
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  headerText: {
    flex: 1,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    padding: 10,
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
});
