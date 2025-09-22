import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

import FestiMateNav from "./components/FestiMateNav";
import FestiMateFooter from "./components/FestiMateFooter";
import FestiMateBreadcrumb from "./components/FestiMateBreadcrumb";

import Homepage from "./pages/public/Homepage";
import Festivals from "./pages/public/Festivals";
import FestivalDetail from "./pages/public/FestivalDetail";
import Artists from "./pages/public/Artists";
import ArtistDetail from "./pages/public/ArtistDetail";
import Login from "./pages/public/Login";
import Registration from "./pages/public/Registration";
import MyProfile from "./pages/public/MyProfile";
import Reservation from "./pages/public/Reservation";
import Wishlist from "./pages/public/Wishlist";
import Reservations from "./pages/public/Reservations";
import Backoffice from "./pages/admin/Backoffice";
import NotFound from "./pages/public/NotFound";

function App() {
  const [userData, setUserData] = useState(null);
  const userRole = useSelector((state) => state.user.role);

  const ProtectedRoute = ({ allowedRoles, children }) => {
    if (!userRole) return <Navigate to="/login" replace />;
    if (!allowedRoles.includes(userRole)) return <Navigate to="/" replace />;
    return children;
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:3002/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setUserData(data))
        .catch(() => setUserData(null));
    }
  }, []);

  return (
    <BrowserRouter>
      <FestiMateNav user={userData} setUserData={setUserData} />
      <FestiMateBreadcrumb />
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/login" element={<Login setUserData={setUserData} />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/" element={<Homepage />} />
        <Route path="/festivals" element={<Festivals userRole={userRole} />} />
        <Route path="/festivals/:id" element={<FestivalDetail userRole={userRole} />} />
        <Route path="/artists" element={<Artists userRole={userRole} />} />
        <Route path="/artists/:id" element={<ArtistDetail userRole={userRole} />} />
        <Route path="/me" element={<MyProfile user={userData} setUserData={setUserData} />} />
        <Route path="public-users/me/wishlist" element={<Wishlist />} />
        <Route path="/reservations/me" element={<Reservations />} />
        <Route path="/reservations/me/register" element={<Reservation />} />

        <Route
          path="/backoffice"
          element={
            <ProtectedRoute allowedRoles={["SYSTEM_ADMIN", "ARTIST_MANAGER", "FESTIVAL_MANAGER", "RESERVATION_MANAGER", "USER_MANAGER"]}>
              <Backoffice />
            </ProtectedRoute>
          }
        />
      </Routes>
      <FestiMateFooter />
    </BrowserRouter>
  );
}

export default App;
