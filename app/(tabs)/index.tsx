import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons'; // Icons are built into Expo

export default function App() {
  // Initial Data
  const initialData = [
    { id: 1, item: "TUBE", bags: "62", kgs: "2142", rs: "18" },
    { id: 2, item: "INJ (GRINDING)", bags: "0", kgs: "0", rs: "40" },
    { id: 3, item: "GEN (MIX)", bags: "26", kgs: "549", rs: "12" },
    { id: 4, item: "COVER", bags: "7", kgs: "161", rs: "3" },
    { id: 5, item: "GLOVES", bags: "4", kgs: "222", rs: "15" },
    { id: 6, item: "LD (GRIND)", bags: "13", kgs: "479", rs: "55" },
    { id: 7, item: "SP (GRIND)", bags: "0", kgs: "0", rs: "30" },
    { id: 8, item: "PP KIT", bags: "0", kgs: "0", rs: "3" },
  ];

  const [rows, setRows] = useState(initialData);

  // Calculate Amount
  const calculateAmount = (kgs: any, rs: any) => {
    const k = parseFloat(kgs) || 0;
    const r = parseFloat(rs) || 0;
    return Math.round(k * r);
  };

  // Calculate Footer Totals
  const totals = rows.reduce((acc, row) => {
    const bags = parseFloat(row.bags) || 0;
    const kgs = parseFloat(row.kgs) || 0;
    const amount = calculateAmount(row.kgs, row.rs);

    return {
      bags: acc.bags + bags,
      kgs: acc.kgs + kgs,
      amount: acc.amount + amount
    };
  }, { bags: 0, kgs: 0, amount: 0 });

  // Handle Text Change
  const handleChange = (id: any, field: any, value: any) => {
    setRows(rows.map(row => {
      if (row.id === id) {
        return { ...row, [field]: value };
      }
      return row;
    }));
  };

  // Add Row
  const addRow = () => {
    const newId = rows.length > 0 ? Math.max(...rows.map(r => r.id)) + 1 : 1;
    setRows([...rows, { id: newId, item: "", bags: "", kgs: "", rs: "" }]);
  };

  // Delete Row
  const deleteRow = (id: number) => {
    Alert.alert(
      "Delete Item",
      "Are you sure you want to remove this row?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => setRows(rows.filter(row => row.id !== id)) }
      ]
    );
  };

  // Reset Data
  const resetData = () => {
    Alert.alert(
      "Reset Table",
      "Reload default data?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Reset", onPress: () => setRows(initialData) }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Top Toolbar */}
      <View style={styles.toolbar}>
        <Text style={styles.toolbarTitle}>Material Billing</Text>
        <View style={styles.toolbarButtons}>
          <TouchableOpacity onPress={addRow} style={styles.iconButton}>
            <MaterialIcons name="add" size={26} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={resetData} style={styles.iconButton}>
            <MaterialIcons name="refresh" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* Horizontal Scroll for the Grid */}
        <ScrollView horizontal={true} style={styles.horizontalScroll}>
          <ScrollView style={styles.verticalScroll}>
            <View style={styles.tableContainer}>

              {/* Table Header */}
              <View style={styles.headerRow}>
                <Text style={[styles.cell, styles.headerCell, styles.colNo]}>No</Text>
                <Text style={[styles.cell, styles.headerCell, styles.colItem]}>ITEM</Text>
                <Text style={[styles.cell, styles.headerCell, styles.colNum]}>BAGS</Text>
                <Text style={[styles.cell, styles.headerCell, styles.colNum]}>KGS</Text>
                <Text style={[styles.cell, styles.headerCell, styles.colNum]}>RS</Text>
                <Text style={[styles.cell, styles.headerCell, styles.colAmount]}>AMOUNT</Text>
                <Text style={[styles.cell, styles.headerCell, styles.colAction]}></Text>
              </View>

              {/* Table Rows */}
              {rows.map((row, index) => (
                <View key={row.id} style={[styles.row, index % 2 === 0 ? styles.rowEven : styles.rowOdd]}>
                  {/* S.No */}
                  <Text style={[styles.cell, styles.textCenter, styles.colNo]}>{index + 1}</Text>

                  {/* Item */}
                  <TextInput
                    style={[styles.input, styles.colItem, styles.textBold]}
                    value={row.item}
                    onChangeText={(text) => handleChange(row.id, 'item', text)}
                    placeholder="ITEM"
                  />

                  {/* Bags */}
                  <TextInput
                    style={[styles.input, styles.colNum, styles.textCenter]}
                    value={row.bags.toString()}
                    onChangeText={(text) => handleChange(row.id, 'bags', text)}
                    keyboardType="numeric"
                  />

                  {/* KGS */}
                  <TextInput
                    style={[styles.input, styles.colNum, styles.textCenter, styles.textBold]}
                    value={row.kgs.toString()}
                    onChangeText={(text) => handleChange(row.id, 'kgs', text)}
                    keyboardType="numeric"
                  />

                  {/* RS */}
                  <TextInput
                    style={[styles.input, styles.colNum, styles.textCenter]}
                    value={row.rs.toString()}
                    onChangeText={(text) => handleChange(row.id, 'rs', text)}
                    keyboardType="numeric"
                  />

                  {/* Amount (Read-only) */}
                  <Text style={[styles.cell, styles.colAmount, styles.amountText]}>
                    {calculateAmount(row.kgs, row.rs).toLocaleString()}
                  </Text>

                  {/* Delete Action */}
                  <TouchableOpacity onPress={() => deleteRow(row.id)} style={[styles.cell, styles.colAction, styles.centerContent]}>
                    <MaterialIcons name="delete-outline" size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))}

            </View>
          </ScrollView>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Fixed Footer Totals */}
      <View style={styles.footer}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View style={styles.footerContainer}>
            <Text style={[styles.footerCell, styles.colNo, styles.colItem, { textAlign: 'center' }]}>TOTAL</Text>
            <Text style={[styles.footerCell, styles.colNum]}>{totals.bags}</Text>
            <Text style={[styles.footerCell, styles.colNum]}>{totals.kgs}</Text>
            <Text style={[styles.footerCell, styles.colNum]}>=</Text>
            <Text style={[styles.footerCell, styles.colAmount, { backgroundColor: '#466d2b' }]}>
              {totals.amount.toLocaleString()}
            </Text>
            <Text style={[styles.footerCell, styles.colAction]}></Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

// Styles imitating the spreadsheet look
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingTop: Platform.OS === 'android' ? 35 : 0,
  },
  toolbar: {
    backgroundColor: '#1e293b',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
  },
  toolbarTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  toolbarButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  iconButton: {
    padding: 4,
  },
  horizontalScroll: {
    flex: 1,
  },
  verticalScroll: {
    flex: 1,
  },
  tableContainer: {
    paddingBottom: 20,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    height: 50,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#C55A11', // Orange from image
    height: 45,
    alignItems: 'center',
  },
  rowEven: { backgroundColor: 'white' },
  rowOdd: { backgroundColor: '#f9fafb' },

  // Column Widths (Fixed for spreadsheet feel)
  colNo: { width: 40 },
  colItem: { width: 160 },
  colNum: { width: 70 },
  colAmount: { width: 100 },
  colAction: { width: 40 },

  // Cell Styles
  cell: {
    paddingHorizontal: 5,
    fontSize: 14,
    color: '#333',
  },
  headerCell: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 13,
    borderRightWidth: 1,
    borderRightColor: '#a04000',
  },
  input: {
    height: '100%',
    paddingHorizontal: 5,
    fontSize: 14,
    color: '#1f2937',
    borderRightWidth: 1,
    borderRightColor: '#f3f4f6',
  },

  // Text Utils
  textCenter: { textAlign: 'center' },
  textBold: { fontWeight: 'bold' },
  amountText: {
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#f3f4f6',
    paddingVertical: 15,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Footer
  footer: {
    backgroundColor: '#548235', // Green from image
    elevation: 10,
  },
  footerContainer: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
  },
  footerCell: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 12,
    borderRightWidth: 1,
    borderRightColor: '#426a26',
  },
});
