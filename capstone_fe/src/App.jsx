import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

  const ProtectedRoute = ({ allowedRoles, children }) => {
    if (!userData) return <Navigate to="/login" replace />;

    if (allowedRoles && (!userData.role || !allowedRoles.includes(userData.role))) return <Navigate to="/" replace />;
    return children;
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:3002/admins/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw res;
          return res.json();
        })
        .then((data) => setUserData({ ...data, role: data.role }))
        .catch(() =>
          fetch("http://localhost:3002/public-users/me", {
            headers: { Authorization: `Bearer ${token}` },
          })
            .then((res) => {
              if (!res.ok) throw res;
              return res.json();
            })
            .then((data) => setUserData({ ...data, role: null }))
            .catch(() => setUserData(null))
        );
    } else {
      setUserData(null);
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
        <Route path="/festivals" element={<Festivals user={userData} />} />
        <Route path="/festivals/:id" element={<FestivalDetail user={userData} />} />
        <Route path="/artists" element={<Artists user={userData} />} />
        <Route path="/artists/:id" element={<ArtistDetail user={userData} />} />

        <Route path="/me" element={<MyProfile user={userData} setUserData={setUserData} />} />
        <Route path="/public-users/me/wishlist" element={<Wishlist user={userData} />} />
        <Route path="/reservations/me" element={<Reservations user={userData} />} />
        <Route path="/reservations/me/register" element={<Reservation user={userData} />} />

        <Route
          path="/backoffice"
          element={
            <ProtectedRoute allowedRoles={["SYSTEM_ADMIN", "ARTIST_MANAGER", "FESTIVAL_MANAGER", "RESERVATION_MANAGER", "USER_MANAGER"]}>
              <Backoffice user={userData} />
            </ProtectedRoute>
          }
        />
      </Routes>

      <FestiMateFooter />
    </BrowserRouter>
  );
}

export default App;
