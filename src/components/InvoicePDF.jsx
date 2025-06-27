import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import logo from "../assets/billingLogo.png"; // Replace with actual path or base64

const styles = StyleSheet.create({
  page: {
    width: 162, // 57mm
    padding: 5,
    fontSize: 8,
    fontFamily: "Helvetica",
    color: "#000",
  },
  center: { textAlign: "center" },
  logo: {
    width: 40,
    height: 40,
    marginBottom: 2,
    alignSelf: "center",
  },
  title: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 2,
  },
  line: {
    borderBottom: "1pt solid black",
    marginVertical: 3,
  },
  section: { marginBottom: 2 },
  tableHeader: {
    flexDirection: "row",
    borderBottom: "1pt solid black",
    marginTop: 5,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 1,
  },
  cell: { flex: 1 },
  small: { fontSize: 7 },
  total: {
    marginTop: 5,
    textAlign: "right",
    fontWeight: "bold",
  },
});

const InvoicePDF = ({ invoice }) => (
  <Document>
    <Page size={{ width: 162 }} style={styles.page} wrap={false}>
      {/* Logo and Header */}
      <Image style={styles.logo} src={logo} />
      <Text style={[styles.center, styles.title]}>Buzz Cafe</Text>
      <Text style={[styles.center, styles.small]}>
        Shop No 04, Dattprasad Apartment, Near Gas Godown, Makhamalabad Road Nashik MH
      </Text>
      <Text style={[styles.center, styles.small]}>Phone: +91-9503745899</Text>
      <View style={styles.line} />

      {/* Customer Details */}
      <View style={styles.section}>
        <Text style={styles.small}>Customer: {invoice.customerName}</Text>
        <Text style={styles.small}>Table: {invoice.tableNumber}</Text>
        <Text style={styles.small}>Date: {invoice.date}</Text>
      </View>

      {/* Item Table */}
      <View style={styles.tableHeader}>
        <Text style={[styles.cell, styles.small]}>Item</Text>
        <Text style={[styles.cell, styles.small, { textAlign: "center" }]}>
          Qty
        </Text>
        <Text style={[styles.cell, styles.small, { textAlign: "right" }]}>
          Price
        </Text>
      </View>

      {invoice.items.map((item, index) => (
        <View style={styles.tableRow} key={index}>
          <Text style={[styles.cell, styles.small]}>{item.name}</Text>
          <Text
            style={[styles.cell, styles.small, { textAlign: "center" }]}
          >
            {item.qty}
          </Text>
          <Text
            style={[styles.cell, styles.small, { textAlign: "right" }]}
          >
            {(item.qty * item.price).toFixed(2)}
          </Text>
        </View>
      ))}

      {/* Total */}
      <View style={styles.total}>
        <Text style={styles.small}>Total: {invoice.total.toFixed(2)}</Text>
      </View>

      <View style={styles.line} />
      <Text style={[styles.center, styles.small]}>
        Thank you! Visit Again
      </Text>
    </Page>
  </Document>
);

export default InvoicePDF;
