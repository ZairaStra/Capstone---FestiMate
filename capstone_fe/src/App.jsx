import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function App() {
  const userRole = useSelector((state) => state.user.role);

  const RoleRoute = ({ allowedRoles, element }) => {
    return allowedRoles.includes(userRole) ? element : <Navigate to="/" />;
  };

  return (
    <BrowserRouter>
      <Navbar />
      <Sidebar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Homepage />} />
        <Route path="/festivals" element={<Festivals userRole={userRole} />} />
        <Route path="/festivals/:id" element={<FestivalDetail userRole={userRole} />} />
        <Route path="/artists" element={<Artists userRole={userRole} />} />
        <Route path="/artists/:id" element={<ArtistDetail userRole={userRole} />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/me" element={<MyProfile />} />
        <Route path="/settings" element={<Settings />} />

        <Route path="/admin/users" element={<RoleRoute allowedRoles={["USER_MANAGER"]} element={<Users />} />} />
        <Route path="/admin/admins" element={<RoleRoute allowedRoles={["SYSTEM_ADMIN"]} element={<Admins />} />} />
        <Route path="/admin/reservations" element={<RoleRoute allowedRoles={["RESERVATION_MANAGER"]} element={<Reservations />} />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
