import { Document, Text, Page, StyleSheet, Image, View } from "@react-pdf/renderer";
import React from 'react'
import axios from "axios";
import { useState, useEffect } from "react";

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

function Pdf( ) {

    const [extensiones, setExtensiones] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get('http://172.16.2.241:1337/api/extensions');
            setExtensiones(response.data.data); // Accedemos al campo "data" en la respuesta
          } catch (error) {
            console.error('Error fetching data:', error.message, error.response);
          }
        };
    
        fetchData();
      }, []);
    
      const atributosSeleccionados = ["nombre", "extension", "area", "sede"];

  return (
   
<>
 <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>Listado de extensiones IMEVI</Text>
        <View style={styles.table}>
          {/* Encabezado de la tabla */}
          <View style={styles.tableRow}>
            {atributosSeleccionados.map((atributo, index) => (
              <View style={styles.tableCol} key={index}>
                <Text style={[styles.cell, styles.bold, styles.uppercase]}>
                  {atributo.toUpperCase()}
                </Text>
              </View>
            ))}
          </View>
          
          {/* Datos de la tabla */}
          {extensiones.map((fila, index) => (
            <View style={styles.tableRow} key={index}>
              {atributosSeleccionados.map((atributo, colIndex) => (
                <View style={styles.tableCol} key={colIndex}>
                  <Text style={styles.cell}>
                    {fila.attributes[atributo] != null ? fila.attributes[atributo] : ''}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </View>
    </Page>
  </Document>
</>


  )
}

export default Pdf