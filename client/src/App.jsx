import { Route, Routes } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from './Context/Auth';
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/login";
import Library from './pages/Library';
import Dashboard from "./pages/Dashboard";
import Footer from "./components/Footer";
import BookDetailPage from "./pages/singleBook";
import Issues from "./pages/issues";
import NotificationsPage from "./pages/NotificationPage";
import Members from "./pages/Members";
import Reservations from "./pages/Reservations";
import Reports from "./pages/Reports";
import Books from "./pages/Books";
import Return from "./pages/Return";
import RegisterPage from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import ReservedIsued from "./pages/ResrvedAndIsued";
import ResetPasswordPage from "./pages/ResetPassword";

const App = () => {
  const { isLoggedIn } = useAuth();
  const isAdmin = JSON.parse(localStorage.getItem("isAdmin"));

  return (
    <div className="flex flex-col min-h-screen">
      <ToastContainer />
      <Navbar isLoggedIn={isLoggedIn} />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route
          path="/library"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Library />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reserveissue"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <ReservedIsued/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn} isAdmin={isAdmin}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book/:isbn"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <BookDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/issues"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Issues />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notification"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/members"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Members />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reservations"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Reservations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/report"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/returns"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Return />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Books />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Footer />
    </div>
  );
};

export default App;
