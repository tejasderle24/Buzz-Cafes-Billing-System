import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateInvoice from "./pages/CreateInvoice";
import InvoiceDetail from "./pages/InvoiceDetail";
import AdminLayout from "./layout/AdminLayout";
import ManageMenu from "./pages/ManageMenu";
import YourInvoices from "./pages/YourInvoices";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<AdminLayout />}>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-invoice"
          element={
            <ProtectedRoute>
              <CreateInvoice />
            </ProtectedRoute>
          }
        />
        <Route
          path="/invoice/:id"
          element={
            <ProtectedRoute>
              <InvoiceDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/menu"
          element={
            <ProtectedRoute>
              <ManageMenu />
            </ProtectedRoute>
          }
        />
        <Route
          path="/your-invoices"
          element={
            <ProtectedRoute>
              <YourInvoices />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
