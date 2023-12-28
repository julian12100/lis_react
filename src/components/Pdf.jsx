import { Document, Text, Page, StyleSheet, View, Image } from "@react-pdf/renderer";
import React, { useState, useEffect } from 'react';
import axios from "axios";
import logoImevi from '../img/logo-footer.png';

const newStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  pbx: {
    fontSize: 9,
    textAlign: 'center', // Centrar horizontalmente
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  textContainer: {
    marginLeft: 10,
  },
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: { margin: 'auto', flexDirection: 'row' },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  bold: {
    fontWeight: 'bold',
  },
  uppercase: {
    textTransform: 'uppercase',
  },
  cell: { margin: 'auto', marginTop: 5, fontSize: 10 },
});

function Pdf({ filtrosede }) {
  const [extensiones, setExtensiones] = useState([]);
  const [filtroSede, setFiltroSede] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://172.16.2.15:1339/api/extensions');
        setExtensiones(response.data.data);
      } catch (error) {
        console.error('Error fetching data:', error.message, error.response);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (filtrosede && filtrosede.length > 0) {
      const sedeIds = filtrosede.map(item => item.id);
      setFiltroSede(sedeIds);
    }
  }, [filtrosede]);

  const atributosSeleccionados = ["nombre", "extension", "area", "sede"];

  const extensionesFiltradas = filtroSede.length > 0
    ? extensiones.filter((fila) => filtroSede.includes(fila.id))
    : extensiones;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <View style={newStyles.container}>
            <Image style={newStyles.logo} source={logoImevi} />
            <View style={newStyles.textContainer}>
              <Text style={newStyles.title}>Listado de extensiones</Text>
              <Text style={newStyles.pbx}>PBX 746 27 49</Text>
            </View>
          </View>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              {atributosSeleccionados.map((atributo, index) => (
                <View style={styles.tableCol} key={index}>
                  <Text style={[styles.cell, styles.bold, styles.uppercase]}>
                    {atributo.toUpperCase()}
                  </Text>
                </View>
              ))}
            </View>

            {extensionesFiltradas.map((fila, index) => (
              <View style={styles.tableRow} key={index}>
                {atributosSeleccionados.map((atributo, colIndex) => (
                  <View style={styles.tableCol} key={colIndex}>
                    <Text style={styles.cell}>
                      {fila.attributes[atributo] != null
                        ? fila.attributes[atributo]
                        : ""}
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
}

export default Pdf;
