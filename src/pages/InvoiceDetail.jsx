import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "../components/InvoicePDF";

const InvoiceDetail = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const docRef = doc(db, "invoices", id);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          setInvoice(snapshot.data());
        } else {
          console.error("Invoice not found");
        }
      } catch (error) {
        console.error("Error fetching invoice:", error);
      }
    };

    fetchInvoice();
  }, [id]);

  if (!invoice) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Invoice Detail</h1>

        <PDFDownloadLink
          document={<InvoicePDF invoice={invoice} />}
          fileName={`invoice-${id}.pdf`}
        >
          {({ loading }) =>
            loading ? (
              <Button disabled>Preparing PDF...</Button>
            ) : (
              <Button>Download PDF</Button>
            )
          }
        </PDFDownloadLink>
      </div>

      <div className="bg-white p-6 rounded shadow space-y-4">
        <div>
          <p className="font-semibold">Customer Name:</p>
          <p>{invoice.customerName}</p>
        </div>

        <div>
          <p className="font-semibold">Table Number:</p>
          <p>{invoice.tableNumber}</p>
        </div>

        <div>
          <p className="font-semibold">Items:</p>
          <table className="w-full border mt-2 text-left text-sm">
            <thead>
              <tr>
                <th className="border px-2 py-1">Item</th>
                <th className="border px-2 py-1">Qty</th>
                <th className="border px-2 py-1">Price</th>
                <th className="border px-2 py-1">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, i) => (
                <tr key={i}>
                  <td className="border px-2 py-1">{item.name}</td>
                  <td className="border px-2 py-1">{item.qty}</td>
                  <td className="border px-2 py-1">₹{item.price}</td>
                  <td className="border px-2 py-1">
                    ₹{(item.qty * item.price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-right text-lg font-bold">
          Total: ₹{invoice.total.toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;
