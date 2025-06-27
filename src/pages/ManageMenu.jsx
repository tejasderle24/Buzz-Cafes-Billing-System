import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const ManageMenu = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", category: "" });
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [open, setOpen] = useState(false);

  const fetchItems = async () => {
    const snapshot = await getDocs(collection(db, "menu"));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setItems(data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAddOrUpdate = async () => {
    if (!form.name || !form.price) return;

    if (editId) {
      await updateDoc(doc(db, "menu", editId), {
        name: form.name,
        price: parseFloat(form.price),
        category: form.category,
      });
      setEditId(null);
    } else {
      await addDoc(collection(db, "menu"), {
        name: form.name,
        price: parseFloat(form.price),
        category: form.category,
      });
    }

    setForm({ name: "", price: "", category: "" });
    setOpen(false);
    fetchItems();
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "menu", id));
    fetchItems();
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setForm({
      name: item.name,
      price: item.price.toString(),
      category: item.category || "",
    });
    setOpen(true);
  };

  const categories = ["All", ...new Set(items.map((item) => item.category).filter(Boolean))];

  const filteredItems = items.filter((item) => {
    const matchCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-4 font-secondary">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Menu</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <span>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white">Add New Item</Button>
            </span>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editId ? "Edit Item" : "Add New Item"}</DialogTitle>
            </DialogHeader>

            <div className="space-y-3">
              <Input
                placeholder="Item name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <Input
                placeholder="Price"
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
              <Input
                placeholder="Category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button className="bg-green-500 hover:bg-green-600 text-white" onClick={handleAddOrUpdate}>
                {editId ? "Update" : "Add"}
              </Button>
              {editId && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditId(null);
                    setForm({ name: "", price: "", category: "" });
                    setOpen(false);
                  }}
                >
                  Cancel
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap items-center">
        <Input
          placeholder="Search by name..."
          className="max-w-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border rounded px-3 py-2"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 mt-4">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Sr. No</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center px-4 py-3 text-gray-500">
                  No items found.
                </td>
              </tr>
            ) : (
              filteredItems.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2 font-medium">{index + 1}</td>
                  <td className="px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2">₹{item.price}</td>
                  <td className="px-4 py-2">{item.category || "-"}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <Button className="bg-green-500 hover:bg-green-600 text-white" size="sm" onClick={() => handleEdit(item)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageMenu;
