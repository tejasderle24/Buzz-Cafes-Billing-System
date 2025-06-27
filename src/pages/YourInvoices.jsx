import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";

import { auth, db } from "../firebase/config";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const YourInvoices = () => {
    const [invoices, setInvoices] = useState([]);
    const [search, setSearch] = useState("");

    const navigate = useNavigate();

    const filteredInvoices = invoices.filter((invoice) => {
        const query = search.toLowerCase();
        return (
            invoice.customerName.toLowerCase().includes(query) ||
            (invoice.tableNumber && invoice.tableNumber.toString().includes(query))
        );
    });


    useEffect(() => {
        const q = query(
            collection(db, "invoices"),
            where("userId", "==", auth.currentUser.uid),
            orderBy("createdAt", "desc") // 👈 Add this line
        );


        const unsub = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setInvoices(data);
        });

        return () => unsub();
    }, []);

    return (
        <div className="p-4 font-secondary">
            <div className="flex justify-between items-center mb-4 ">
                <h1 className="text-2xl font-bold">Your Invoices</h1>
                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by customer or table no."
                        className="border px-3 py-2 rounded-md w-64 text-sm"
                    />

                    <Button onClick={() => navigate("/create-invoice")}>
                        + Create Invoice
                    </Button>
                </div>
            </div>

            {invoices.length === 0 ? (
                <p>No invoices found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300 rounded-md overflow-hidden">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 text-left">Sr. No</th>
                                <th className="px-4 py-2 text-left">Customer</th>
                                <th className="px-4 py-2 text-left">Table No</th>
                                <th className="px-4 py-2 text-left">Total</th>
                                <th className="px-4 py-2 text-left">Created At</th>
                                <th className="px-4 py-2 text-left">Payment Method</th>
                                <th className="px-4 py-2 text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInvoices.map((invoice, index) => (
                                <tr
                                    key={invoice.id}
                                    className="hover:bg-gray-50 transition duration-150"
                                >
                                    <td className="px-4 py-2">{index + 1}</td>
                                    <td className="px-4 py-2">{invoice.customerName}</td>
                                    <td className="px-4 py-2">{invoice.tableNumber}</td>
                                    <td className="px-4 py-2">₹{invoice.total}</td>
                                    <td className="px-4 py-2 text-sm text-gray-500">
                                        {new Date(invoice.createdAt.seconds * 1000).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-2">{invoice.paymentMethod}</td>
                                    <td className="px-4 py-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => navigate(`/invoice/${invoice.id}`)}
                                        >
                                            View
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default YourInvoices;
