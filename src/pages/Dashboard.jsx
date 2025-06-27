import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { db } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function Dashboard() {
  const [invoices, setInvoices] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "invoices"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      }));
      setInvoices(data);
    };
    fetchData();
  }, []);

  // 🔍 Filter by Date Range
  const filteredInvoices = invoices.filter((inv) => {
    const invDate = inv.createdAt;
    if (startDate && invDate < startDate) return false;
    if (endDate && invDate > endDate) return false;
    return true;
  });

  // 📈 Sales by Date
  const salesByDate = filteredInvoices.reduce((acc, invoice) => {
    const date = invoice.createdAt.toISOString().split("T")[0];
    acc[date] = (acc[date] || 0) + invoice.total;
    return acc;
  }, {});
  const chartData = Object.entries(salesByDate).map(([date, total]) => ({
    date,
    total,
  }));

  // 🍽️ Top Items
  const itemMap = {};
  filteredInvoices.forEach((inv) =>
    inv.items.forEach((item) => {
      if (!itemMap[item.name]) itemMap[item.name] = 0;
      itemMap[item.name] += item.qty;
    })
  );
  const topItems = Object.entries(itemMap).map(([name, qty]) => ({
    name,
    qty,
  }));

  // 📤 CSV Export
  const exportCSV = () => {
    const csv = Papa.unparse(filteredInvoices);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "filtered-analytics.csv");
  };

  // 📄 PDF Export
  const exportPDF = async () => {
    const input = document.getElementById("analytics-summary");
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save("analytics-summary.pdf");
  };

  return (
    <div className="p-4 space-y-6 max-w-6xl mx-auto font-secondary">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-2xl font-bold">Sales Analytics</h1>

        <div className="flex items-center gap-4">
          <div>
            <label className="text-sm">Start Date</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              className="border px-2 py-1 rounded"
              placeholderText="Start"
            />
          </div>

          <div>
            <label className="text-sm">End Date</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              className="border px-2 py-1 rounded"
              placeholderText="End"
            />
          </div>

          <Button onClick={exportCSV}>Export CSV</Button>
          <Button onClick={exportPDF}>Export PDF</Button>
        </div>
      </div>

      <div id="analytics-summary" className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Line Chart */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">📈 Sales Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total" stroke="#2563eb" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">🍕 Top Selling Items</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topItems}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="qty" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white p-4 rounded shadow text-right text-lg font-bold">
          Total Sales: ₹
          {filteredInvoices.reduce((sum, inv) => sum + inv.total, 0).toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard