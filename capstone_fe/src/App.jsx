import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import FestiMateNav from "./components/FestiMateNav";
import FestiMateFooter from "./components/FestiMateFooter";
import Homepage from "./pages/public/Homepage";
import Festivals from "./pages/public/Festivals";
import FestivalDetail from "./pages/public/FestivalDetail";
import Artists from "./pages/public/Artists";
import ArtistDetail from "./pages/public/ArtistDetail";

function App() {
  const userRole = useSelector((state) => state.user.role);

  const RoleRoute = ({ allowedRoles, element }) => {
    return allowedRoles.includes(userRole) ? element : <Navigate to="/" />;
  };

  return (
    <BrowserRouter>
      <FestiMateNav />
      <Routes>
        {/*<Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />*/}
        <Route path="/" element={<Homepage />} />
        <Route path="/festivals" element={<Festivals userRole={userRole} />} />
        <Route path="/festivals/:id" element={<FestivalDetail userRole={userRole} />} />
        <Route path="/artists" element={<Artists userRole={userRole} />} />
        <Route path="/artists/:id" element={<ArtistDetail userRole={userRole} />} />
        {/* <Route path="/reservations/me/register" element={<Reservation />} />
        <Route path="/me" element={<MyProfile />} />
        <Route path="/settings" element={<Settings />} />

        <Route path="/admin/users" element={<RoleRoute allowedRoles={["USER_MANAGER"]} element={<Users />} />} />
        <Route path="/admin/admins" element={<RoleRoute allowedRoles={["SYSTEM_ADMIN"]} element={<Admins />} />} />
        <Route path="/admin/reservations" element={<RoleRoute allowedRoles={["RESERVATION_MANAGER"]} element={<Reservations />} />} /> */}
      </Routes>
      <FestiMateFooter />
    </BrowserRouter>
  );
}

export default App;
