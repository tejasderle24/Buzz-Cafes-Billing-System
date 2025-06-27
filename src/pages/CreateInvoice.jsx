import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { db, auth } from "../firebase/config";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";

const CreateInvoice = () => {
  const [menu, setMenu] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [invoiceType, setInvoiceType] = useState("Dine In");
  const [tableNumber, setTableNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenu = async () => {
      const snapshot = await getDocs(collection(db, "menu"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMenu(data);
    };
    fetchMenu();
  }, []);

  const addItem = (item) => {
    const exists = selectedItems.find((i) => i.id === item.id);
    if (exists) {
      setSelectedItems((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + 1 } : i
        )
      );
    } else {
      setSelectedItems([...selectedItems, { ...item, qty: 1 }]);
    }
  };

  const removeItem = (itemId) => {
    setSelectedItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const total = selectedItems.reduce((sum, i) => sum + i.qty * i.price, 0);

  const increaseQty = (itemId) => {
    setSelectedItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, qty: i.qty + 1 } : i))
    );
  };

  const decreaseQty = (itemId) => {
    setSelectedItems((prev) =>
      prev
        .map((i) =>
          i.id === itemId ? { ...i, qty: i.qty - 1 } : i
        )
        .filter((i) => i.qty > 0) // auto remove if qty goes to 0
    );
  };


  const handleSave = async () => {
    if (!customerName || (invoiceType === "Dine In" && !tableNumber) || selectedItems.length === 0) {
      return toast.error("Please fill all required fields");
    }
    try {
      await addDoc(collection(db, "invoices"), {
        userId: auth.currentUser.uid,
        customerName,
        tableNumber: invoiceType === "Dine In" ? tableNumber : "",
        paymentMethod,
        invoiceType,
        items: selectedItems,
        total,
        createdAt: Timestamp.now(),
      });

      toast.success("Invoice saved successfully");
      setCustomerName("");
      setTableNumber("");
      setPaymentMethod("Cash");
      setInvoiceType("Dine In");
      setSelectedItems([]);
      // navigate("/dashboard");
    } catch (err) {
      toast.error("Failed to save invoice");
      console.error(err);
    }
  };

  const handleSaveAndPrint = async () => {
    if (!customerName || (invoiceType === "Dine In" && !tableNumber) || selectedItems.length === 0) {
      return toast.error("Please fill all required fields");
    }
    try {
      const docRef = await addDoc(collection(db, "invoices"), {
        userId: auth.currentUser.uid,
        customerName,
        tableNumber: invoiceType === "Dine In" ? tableNumber : "",
        paymentMethod,
        invoiceType,
        items: selectedItems,
        total,
        createdAt: Timestamp.now(),
      });

      toast.success("Invoice saved successfully");

      // Optional: reset state if needed
      setCustomerName("");
      setTableNumber("");
      setPaymentMethod("Cash");
      setInvoiceType("Dine In");
      setSelectedItems([]);

      // 👇 Redirect to print page with invoice ID
      navigate(`/invoice/${docRef.id}`);
    } catch (err) {
      toast.error("Failed to save invoice");
      console.error(err);
    }
  };


  return (
    <div className="p-2 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[3fr_1.5fr] gap-6">
      {/* Left: Menu Section */}
      <div>
        <h2 className="text-xl font-bold mb-4">Menu</h2>
        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-4 py-2">Item Name</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {menu.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition border-b"
                >
                  <td className="px-4 py-2 font-medium">{item.name}</td>
                  <td className="px-4 py-2 text-gray-600 italic">
                    {item.category || "-"}
                  </td>
                  <td className="px-4 py-2">₹{item.price}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => addItem(item)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-xs"
                    >
                      + Add
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>


      {/* Right: Invoice Section */}
      <div className="space-y-4 flex flex-col justify-end items-center border-2 p-6 rounded-2xl shadow-sm max-w-sm mx-auto">
        <h2 className="text-xl font-bold">Invoice Details</h2>

        {/* Customer Info */}
        <Input
          placeholder="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />

        {/* Invoice Type */}
        <select
          value={invoiceType}
          onChange={(e) => setInvoiceType(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="Dine In">Dine In</option>
          <option value="Takeaway">Takeaway</option>
        </select>

        {/* Conditional Table No */}
        {invoiceType === "Dine In" && (
          <Input
            placeholder="Table Number"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
          />
        )}

        {/* Payment Method */}
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="Cash">Cash</option>
          <option value="Online">Online</option>
        </select>

        {/* Selected Items */}
        <div>
          <h3 className="font-semibold mb-2">Selected Items</h3>
          {selectedItems.length === 0 ? (
            <p className="text-gray-500">No items selected</p>
          ) : (
            <ul className="space-y-2">
              {selectedItems.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between items-center gap-4 border p-2 rounded text-sm"
                >
                  <div className="flex flex-col ">
                    <span className="font-medium">{item.name}</span>
                    {/* <span className="text-xs text-gray-500">
                      ₹{item.price} × {item.qty} = ₹{item.qty * item.price}
                    </span> */}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      className="bg-gray-200 text-gray-800 rounded p-1 hover:bg-gray-300"
                      variant="outline" size="sm" onClick={() => decreaseQty(item.id)}>
                      -
                    </button>
                    <span className="w-6 text-center border">{item.qty}</span>
                    <button
                      className="bg-gray-200 text-gray-800 rounded p-1 hover:bg-gray-300"
                      variant="outline" size="sm" onClick={() => increaseQty(item.id)}>
                      +
                    </button>
                    <button
                      className="bg-red-500 text-white rounded p-1 hover:bg-red-600"
                      size="icon"
                      variant="destructive"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

          )}
          <div className="text-right font-bold text-lg mt-4">
            Total: ₹{total}
          </div>
        </div>

        <Button
          onClick={handleSave}
          className="w-full"
          disabled={
            !customerName ||
            (invoiceType === "Dine In" && !tableNumber) ||
            selectedItems.length === 0
          }
        >
          Save Invoice
        </Button>
        <Button
          onClick={handleSaveAndPrint}
          className="w-full"
          disabled={
            !customerName ||
            (invoiceType === "Dine In" && !tableNumber) ||
            selectedItems.length === 0
          }
        >
          Save & Print Invoice
        </Button>
      </div>
    </div>
  );
};

export default CreateInvoice;
