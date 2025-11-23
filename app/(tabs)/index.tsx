import React, { useState, useRef, useEffect } from 'react';
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
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as ScreenOrientation from 'expo-screen-orientation';

export default function App() {
  const viewShotRef = useRef<View>(null);

  // Unlock orientation on startup so the app can rotate
  useEffect(() => {
    async function unlockOrientation() {
      await ScreenOrientation.unlockAsync();
    }
    unlockOrientation();

    // Optional: Listen for changes to update layout if needed
    const subscription = ScreenOrientation.addOrientationChangeListener((evt) => {
      const newOrientation = evt.orientationInfo.orientation;
      // Logic to adjust UI if strictly needed, currently flex handles it
    });

    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription);
    };
  }, []);

  const initialData = [
    { id: 1, item: "TUBE", bags: "0", kgs: "0", rs: "18" },
    { id: 2, item: "INJ (GRINDING)", bags: "0", kgs: "0", rs: "40" },
    { id: 3, item: "GEN (MIX)", bags: "0", kgs: "0", rs: "12" },
    { id: 4, item: "COVER", bags: "0", kgs: "0", rs: "3" },
    { id: 5, item: "GLOVES", bags: "0", kgs: "0", rs: "15" },
    { id: 6, item: "LD (GRIND)", bags: "0", kgs: "0", rs: "55" },
    { id: 7, item: "SP (GRIND)", bags: "0", kgs: "0", rs: "30" },
    { id: 8, item: "PP KIT", bags: "0", kgs: "0", rs: "3" },
  ];

  const [rows, setRows] = useState(initialData);
  const [tableHeading, setTableHeading] = useState(() => {
    const today = new Date();
    const day = today.getDate();
    const month = today.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const year = today.getFullYear();
    return `MAAL - ${day} ${month} ${year}`;
  });

  // Calculate Amount
  const calculateAmount = (kgs: any, rs: any) => {
    const k = parseFloat(kgs) || 0;
    const r = parseFloat(rs) || 0;
    return Math.round(k * r);
  };

  // Calculate Totals
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

  const handleChange = (id: number, field: string, value: string) => {
    setRows(rows.map(row => {
      if (row.id === id) return { ...row, [field]: value };
      return row;
    }));
  };

  const addRow = () => {
    const newId = rows.length > 0 ? Math.max(...rows.map(r => r.id)) + 1 : 1;
    setRows([...rows, { id: newId, item: "", bags: "", kgs: "", rs: "" }]);
  };

  const deleteRow = (id: number) => {
    Alert.alert("Delete Item", "Remove this row?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => setRows(rows.filter(row => row.id !== id)) }
    ]);
  };

  const resetData = () => {
    Alert.alert("Reset Table", "Reload default data?", [
      { text: "Cancel", style: "cancel" },
      { text: "Reset", onPress: () => setRows(initialData) }
    ]);
  };

  // Screenshot Function
  const takeScreenshot = async () => {
    try {
      // Capture the specific view (Table Container)
      const uri = await captureRef(viewShotRef, {
        format: "png",
        quality: 0.9,
        result: "tmpfile" // Saves to a temporary file
      });

      // Check if sharing is available (it usually is on mobile)
      if (!(await Sharing.isAvailableAsync())) {
        alert(`Screenshot saved to: ${uri}`);
        return;
      }

      // Open the share dialog
      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: 'Share Billing Sheet',
        UTI: 'public.png'
      });
    } catch (error) {
      console.error("Screenshot failed", error);
      Alert.alert("Error", "Could not take screenshot.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Top Toolbar */}
      <View style={styles.toolbar}>
        <Text style={styles.toolbarTitle}>Material Billing</Text>
        <View style={styles.toolbarButtons}>
          <TouchableOpacity onPress={takeScreenshot} style={styles.iconButton}>
            <MaterialIcons name="camera-alt" size={24} color="white" />
          </TouchableOpacity>
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
        <ScrollView style={styles.verticalScroll} contentContainerStyle={{ flexGrow: 1 }}>
          <ScrollView horizontal={true} contentContainerStyle={{ flexGrow: 1 }} style={styles.horizontalScroll}>

            {/* Wrapping the Table in a View with ref.
              collapsable={false} is crucial for Android screenshots to work correctly 
            */}
            <View
              ref={viewShotRef}
              style={styles.screenshotContainer}
              collapsable={false}
            >
              <View style={styles.tableContainer}>
                {/* Header */}
                {/* Editable Table Heading */}
                <View style={styles.headingContainer}>
                  <TextInput
                    style={styles.headingText}
                    value={tableHeading}
                    onChangeText={setTableHeading}
                    placeholder="Enter heading"
                    placeholderTextColor="#94a3b8"
                    textAlign="center"
                  />
                  {/* <MaterialIcons name="edit" size={20} color="#64748b" style={styles.editIcon} /> */}
                </View>

                <View style={styles.headerRow}>
                  <Text style={[styles.cell, styles.headerCell, styles.colNo]}>No</Text>
                  <Text style={[styles.cell, styles.headerCell, styles.colItem]}>ITEM</Text>
                  <Text style={[styles.cell, styles.headerCell, styles.colNum]}>BAGS</Text>
                  <Text style={[styles.cell, styles.headerCell, styles.colNum]}>KGS</Text>
                  <Text style={[styles.cell, styles.headerCell, styles.colNum]}>RS</Text>
                  <Text style={[styles.cell, styles.headerCell, styles.colAmount]}>AMOUNT</Text>
                  <Text style={[styles.cell, styles.headerCell, styles.colAction]}></Text>
                </View>

                {/* Rows */}
                {rows.map((row, index) => (
                  <View key={row.id} style={[styles.row, index % 2 === 0 ? styles.rowEven : styles.rowOdd]}>
                    <Text style={[styles.cell, styles.textCenter, styles.colNo]}>{index + 1}</Text>

                    <TextInput
                      style={[styles.input, styles.colItem, styles.textBold]}
                      value={row.item}
                      onChangeText={(text) => handleChange(row.id, 'item', text)}
                      placeholder="ITEM"
                    />

                    <TextInput
                      style={[styles.input, styles.colNum, styles.textCenter]}
                      value={row.bags.toString()}
                      onChangeText={(text) => handleChange(row.id, 'bags', text)}
                      keyboardType="numeric"
                    />

                    <TextInput
                      style={[styles.input, styles.colNum, styles.textCenter, styles.textBold]}
                      value={row.kgs.toString()}
                      onChangeText={(text) => handleChange(row.id, 'kgs', text)}
                      keyboardType="numeric"
                    />

                    <TextInput
                      style={[styles.input, styles.colNum, styles.textCenter]}
                      value={row.rs.toString()}
                      onChangeText={(text) => handleChange(row.id, 'rs', text)}
                      keyboardType="numeric"
                    />

                    <Text style={[styles.cell, styles.colAmount, styles.amountText]}>
                      {calculateAmount(row.kgs, row.rs).toLocaleString()}
                    </Text>

                    <TouchableOpacity onPress={() => deleteRow(row.id)} style={[styles.cell, styles.colAction, styles.centerContent]}>
                      <MaterialIcons name="delete-outline" size={20} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                ))}

                {/* Footer INSIDE the screenshot area so it's captured too */}
                <View style={styles.footerRow}>
                  <Text style={[styles.footerCell, styles.colNo, styles.colItem, { textAlign: 'center', flexGrow: 1 }]}>TOTAL</Text>
                  <Text style={[styles.footerCell, styles.colNum]}>{totals.bags}</Text>
                  <Text style={[styles.footerCell, styles.colNum]}>{totals.kgs}</Text>
                  <Text style={[styles.footerCell, styles.colNum]}>=</Text>
                  <Text style={[styles.footerCell, styles.colAmount, { backgroundColor: '#466d2b' }]}>
                    {totals.amount.toLocaleString()}
                  </Text>
                  <Text style={[styles.footerCell, styles.colAction]}></Text>
                </View>

              </View>
            </View>
          </ScrollView>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

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
  headingContainer: {
    backgroundColor: '#f8fafc',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#e2e8f0',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  headingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    minWidth: 100,
  },
  editIcon: {
    opacity: 0.6,
  },
  horizontalScroll: {
    flex: 1,
  },
  verticalScroll: {
    flex: 1,
  },
  screenshotContainer: {
    backgroundColor: 'white', // White background for screenshot
    paddingBottom: 50
  },
  tableContainer: {
    minWidth: '100%', // Full width for responsiveness, but allow scrolling if needed
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
    backgroundColor: '#C55A11',
    height: 45,
    alignItems: 'center',
  },
  rowEven: { backgroundColor: 'white' },
  rowOdd: { backgroundColor: '#f9fafb' },
  colNo: { flex: 0.5, minWidth: 40 },
  colItem: { flex: 2, minWidth: 150 },
  colNum: { flex: 1, minWidth: 70 },
  colAmount: { flex: 1.5, minWidth: 100 },
  colAction: { flex: 0.5, minWidth: 40 },
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
  footerRow: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    backgroundColor: '#548235',
    borderTopWidth: 2,
    borderColor: '#333',
    marginTop: 0
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