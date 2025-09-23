//SEARCH, ADDNEW FUNZIONANTI (NON GENERA IMMAGINE DEL PROFILO)- NON PUT, niente alert
{
  /*import { useState, useEffect } from "react";
import { Container, Row, Col, Alert } from "react-bootstrap";
import FestiMateSearchbar from "../../components/FestiMateSearchbar";
import FestiMateListgroup from "../../components/FestiMateListgroup";
import FestiMateButton from "../../components/FestiMateButton";
import FestiMateModal from "../../components/FestiMateModal";
import FestiMateForm from "../../components/FestiMateForm";
import FestiMateSpinner from "../../components/FestiMateSpinner";

const Backoffice = ({ user }) => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalData, setModalData] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const [selectOptions, setSelectOptions] = useState({
    admins: [],
    artists: [],
    festivals: [],
  });

  const admin = user;

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!admin) return;

    const fetchItems = async () => {
      setLoading(true);
      try {
        let url = "";
        switch (admin.role) {
          case "SYSTEM_ADMIN":
            url = "http://localhost:3002/admins";
            break;
          case "ARTIST_MANAGER":
            url = "http://localhost:3002/artists";
            break;
          case "FESTIVAL_MANAGER":
            url = "http://localhost:3002/festivals";
            break;
          case "RESERVATION_MANAGER":
            url = "http://localhost:3002/reservations";
            break;
          case "USER_MANAGER":
            url = "http://localhost:3002/public-users";
            break;
          default:
            url = "";
        }
        if (!url) return;

        const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) throw new Error("Failed to fetch items");
        const data = await res.json();
        console.log("Fetched items:", data);

        const itemsArray = Array.isArray(data) ? data : data.admins || data.artists || data.festivals || data.publicUsers || data.content || [];
        setItems(itemsArray);
        setFilteredItems(itemsArray);

        if (admin.role === "FESTIVAL_MANAGER" || admin.role === "LINEUP_MANAGER") {
          const [adminRes, artistRes, festivalRes] = await Promise.all([
            fetch("http://localhost:3002/admins", { headers: { Authorization: `Bearer ${token}` } }),
            fetch("http://localhost:3002/artists", { headers: { Authorization: `Bearer ${token}` } }),
            fetch("http://localhost:3002/festivals", { headers: { Authorization: `Bearer ${token}` } }),
          ]);
          setSelectOptions({
            admins: adminRes.ok ? await adminRes.json() : [],
            artists: artistRes.ok ? await artistRes.json() : [],
            festivals: festivalRes.ok ? await festivalRes.json() : [],
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [admin, token]);

  const handleSearch = (query) => {
    setSearch(query);
    const lowerQuery = query.toLowerCase();
    setFilteredItems(
      items.filter(
        (i) => i.name?.toLowerCase().includes(lowerQuery) || i.username?.toLowerCase().includes(lowerQuery) || i.email?.toLowerCase().includes(lowerQuery)
      )
    );
  };

  const handleAddNew = (type) => {
    setModalType(type);
    setModalData({});
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setModalData({ ...item });
    setModalType(
      admin.role === "FESTIVAL_MANAGER" ? "festival" : admin.role === "ARTIST_MANAGER" ? "artist" : admin.role === "USER_MANAGER" ? "user" : "admin"
    );
    setShowModal(true);
  };

  const handleDelete = async (item) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      let url = "";
      switch (modalType) {
        case "festival":
          url = `http://localhost:3002/festivals/${item.id}`;
          break;
        case "artist":
          url = `http://localhost:3002/artists/${item.id}`;
          break;
        case "user":
          url = `http://localhost:3002/public-users/${item.id}`;
          break;
        case "admin":
          url = `http://localhost:3002/admins/${item.id}`;
          break;
        case "lineup":
          url = `http://localhost:3002/lineups/${item.id}`;
          break;
        default:
          return;
      }
      const res = await fetch(url, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error("Failed to delete item");

      setItems((prev) => prev.filter((i) => i.id !== item.id));
      setFilteredItems((prev) => prev.filter((i) => i.id !== item.id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleModalSubmit = async (formData) => {
    if (!modalType) return;
    setModalLoading(true);
    try {
      let url = "";
      let method = modalData?.id ? "PUT" : "POST";

      switch (modalType) {
        case "festival":
          url = modalData?.id ? `http://localhost:3002/festivals/${modalData.id}` : "http://localhost:3002/festivals/register";
          break;
        case "artist":
          url = modalData?.id ? `http://localhost:3002/artists/${modalData.id}` : "http://localhost:3002/artists/register";
          break;
        case "user":
          url = modalData?.id ? `http://localhost:3002/public-users/${modalData.id}` : "http://localhost:3002/public-users";
          break;
        case "admin":
          url = modalData?.id ? `http://localhost:3002/admins/${modalData.id}` : "http://localhost:3002/admins/register";
          break;
        case "lineup":
          url = modalData?.id ? `http://localhost:3002/lineups/${modalData.id}` : "http://localhost:3002/lineups/register";
          break;
        default:
          return;
      }

      const hasFile = formData.coverImg || formData.profileImg || formData.campingMap;
      let options = { method, headers: { Authorization: `Bearer ${token}` }, body: hasFile ? new FormData() : JSON.stringify(formData) };
      if (hasFile) {
        const fd = new FormData();
        Object.keys(formData).forEach((k) => {
          if (formData[k] != null) fd.append(k, formData[k]);
        });
        options.body = fd;
      } else {
        options.headers["Content-Type"] = "application/json";
      }

      const res = await fetch(url, options);
      if (!res.ok) throw new Error("Failed to save item");
      const savedItem = await res.json();

      if (modalData?.id) {
        setItems((prev) => prev.map((i) => (i.id === savedItem.id ? savedItem : i)));
        setFilteredItems((prev) => prev.map((i) => (i.id === savedItem.id ? savedItem : i)));
      } else {
        setItems((prev) => [savedItem, ...prev]);
        setFilteredItems((prev) => [savedItem, ...prev]);
      }

      setShowModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setModalLoading(false);
    }
  };

  const getModalFields = () => {
    if (!modalType) return [];
    const data = modalData || {};

    switch (modalType) {
      case "festival":
        return [
          { id: "name", label: "Festival Name", value: data.name || "", onChange: (e) => setModalData({ ...data, name: e.target.value }) },
          { id: "city", label: "City", value: data.city || "", onChange: (e) => setModalData({ ...data, city: e.target.value }) },
          { id: "country", label: "Country", value: data.country || "", onChange: (e) => setModalData({ ...data, country: e.target.value }) },
          {
            id: "startDate",
            label: "Start Date",
            type: "date",
            value: data.startDate || "",
            onChange: (e) => setModalData({ ...data, startDate: e.target.value }),
          },
          { id: "endDate", label: "End Date", type: "date", value: data.endDate || "", onChange: (e) => setModalData({ ...data, endDate: e.target.value }) },
          {
            id: "maxNumbPartecipants",
            label: "Max Participants",
            type: "number",
            value: data.maxNumbPartecipants || "",
            onChange: (e) => setModalData({ ...data, maxNumbPartecipants: e.target.value }),
          },
          {
            id: "dailyPrice",
            label: "Daily Price",
            type: "number",
            step: "0.1",
            value: data.dailyPrice || "",
            onChange: (e) => setModalData({ ...data, dailyPrice: e.target.value }),
          },
          { id: "coverImg", label: "Cover Image", type: "file", value: "", onChange: (e) => setModalData({ ...data, coverImg: e.target.files[0] }) },
          { id: "campingMap", label: "Camping Map", type: "file", value: "", onChange: (e) => setModalData({ ...data, campingMap: e.target.files[0] }) },
          {
            id: "eventPlanner",
            label: "Event Planner",
            type: "select",
            options: selectOptions.admins.map((a) => ({ value: a.id, label: a.username })),
            value: data.eventPlanner?.id || "",
            onChange: (e) => setModalData({ ...data, eventPlanner: { id: e.target.value } }),
          },
        ];
      case "artist":
        return [
          { id: "name", label: "Artist Name", value: data.name || "", onChange: (e) => setModalData({ ...data, name: e.target.value }) },
          {
            id: "genre",
            label: "Genre",
            type: "select",
            options: [
              { value: "ROCK", label: "Rock" },
              { value: "POP", label: "Pop" },
              { value: "JAZZ", label: "Jazz" },
              { value: "ELECTRONIC", label: "Electronic" },
            ],
            value: data.genre || "",
            onChange: (e) => setModalData({ ...data, genre: e.target.value }),
          },
          { id: "link", label: "Link", value: data.link || "", onChange: (e) => setModalData({ ...data, link: e.target.value }) },
          { id: "coverImg", label: "Cover Image", type: "file", value: "", onChange: (e) => setModalData({ ...data, coverImg: e.target.files[0] }) },
        ];
      case "user":
        return [
          { id: "username", label: "Username", value: data.username || "", onChange: (e) => setModalData({ ...data, username: e.target.value }) },
          { id: "name", label: "Name", value: data.name || "", onChange: (e) => setModalData({ ...data, name: e.target.value }) },
          { id: "surname", label: "Surname", value: data.surname || "", onChange: (e) => setModalData({ ...data, surname: e.target.value }) },
          { id: "email", label: "Email", value: data.email || "", onChange: (e) => setModalData({ ...data, email: e.target.value }) },
          { id: "city", label: "City", value: data.city || "", onChange: (e) => setModalData({ ...data, city: e.target.value }) },
          { id: "country", label: "Country", value: data.country || "", onChange: (e) => setModalData({ ...data, country: e.target.value }) },
          { id: "profileImg", label: "Profile Image", type: "file", value: "", onChange: (e) => setModalData({ ...data, profileImg: e.target.files[0] }) },
        ];
      case "admin":
        return [
          { id: "username", label: "Username", value: data.username || "", onChange: (e) => setModalData({ ...data, username: e.target.value }) },
          { id: "name", label: "Name", value: data.name || "", onChange: (e) => setModalData({ ...data, name: e.target.value }) },
          { id: "surname", label: "Surname", value: data.surname || "", onChange: (e) => setModalData({ ...data, surname: e.target.value }) },
          { id: "email", label: "Email", value: data.email || "", onChange: (e) => setModalData({ ...data, email: e.target.value }) },
          {
            id: "password",
            label: "Password",
            type: "password",
            value: data.password || "",
            onChange: (e) => setModalData({ ...data, password: e.target.value }),
          },
          { id: "phoneNumber", label: "Phone Number", value: data.phoneNumber || "", onChange: (e) => setModalData({ ...data, phoneNumber: e.target.value }) },
          {
            id: "role",
            label: "Role",
            type: "select",
            options: [
              { value: "SYSTEM_ADMIN", label: "System Admin" },
              { value: "ARTIST_MANAGER", label: "Artist Manager" },
              { value: "FESTIVAL_MANAGER", label: "Festival Manager" },
              { value: "RESERVATION_MANAGER", label: "Reservation Manager" },
              { value: "USER_MANAGER", label: "User Manager" },
            ],
            value: data.role || "",
            onChange: (e) => setModalData({ ...data, role: e.target.value }),
          },
        ];

      default:
        return [];
    }
  };

  return (
    <Container className="mb-5" style={{ minHeight: "80vh" }}>
      <Row className="align-items-center mb-3">
        <Col xs={12} md={8}>
          <FestiMateSearchbar value={search} onChange={handleSearch} onSearch={handleSearch} />
        </Col>
        <Col xs={12} md={4} className="text-end">
          <FestiMateButton
            onClick={() =>
              handleAddNew(
                admin.role === "FESTIVAL_MANAGER" ? "festival" : admin.role === "ARTIST_MANAGER" ? "artist" : admin.role === "USER_MANAGER" ? "user" : "admin"
              )
            }
          >
            Add New
          </FestiMateButton>
        </Col>
      </Row>

      {loading && <FestiMateSpinner />}
      {!loading && filteredItems.length === 0 && <Alert variant="warning">No items found</Alert>}

      {!loading && filteredItems.length > 0 && (
        <FestiMateListgroup
          items={filteredItems.map((i) => ({
            id: i.id,
            label: (
              <Row className="align-items-center  gy-4">
                <Col xs={12} sm={8}>
                  {Object.entries(i).map(([key, value]) => (
                    <div key={key}>
                      <strong>{key}:</strong> {value?.name || value?.username || value?.toString?.() || ""}
                    </div>
                  ))}
                </Col>
                <Col xs={12} sm={4}>
                  <Row className="gy-3">
                    <Col>
                      <FestiMateButton
                        className="me-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(i);
                        }}
                      >
                        Edit
                      </FestiMateButton>
                    </Col>
                    <Col>
                      <FestiMateButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(i);
                        }}
                      >
                        Delete
                      </FestiMateButton>
                    </Col>
                  </Row>
                </Col>
              </Row>
            ),
          }))}
        />
      )}

      <FestiMateModal show={showModal} onClose={() => setShowModal(false)} title={modalData?.id ? "Edit Item" : "Add New Item"}>
        <FestiMateForm
          fields={getModalFields()}
          onSubmit={() => handleModalSubmit(modalData)}
          loading={modalLoading}
          submitLabel={modalData?.id ? "Save Changes" : "Add Item"}
        />
      </FestiMateModal>
    </Container>
  );
};

export default Backoffice;*/
}

//ALERT Sì, NON SALVA E NON AGGIORNA ADMIN
{
  /*
import { useState, useEffect } from "react";
import { Container, Row, Col, Alert } from "react-bootstrap";
import FestiMateSearchbar from "../../components/FestiMateSearchbar";
import FestiMateListgroup from "../../components/FestiMateListgroup";
import FestiMateButton from "../../components/FestiMateButton";
import FestiMateModal from "../../components/FestiMateModal";
import FestiMateForm from "../../components/FestiMateForm";
import FestiMateSpinner from "../../components/FestiMateSpinner";

const Backoffice = ({ user }) => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalData, setModalData] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const [selectOptions, setSelectOptions] = useState({
    admins: [],
    artists: [],
    festivals: [],
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const admin = user;
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!admin) return;

    const fetchItems = async () => {
      setLoading(true);
      try {
        let url = "";
        switch (admin.role) {
          case "SYSTEM_ADMIN":
            url = "http://localhost:3002/admins";
            break;
          case "ARTIST_MANAGER":
            url = "http://localhost:3002/artists";
            break;
          case "FESTIVAL_MANAGER":
            url = "http://localhost:3002/festivals";
            break;
          case "RESERVATION_MANAGER":
            url = "http://localhost:3002/reservations";
            break;
          case "USER_MANAGER":
            url = "http://localhost:3002/public-users";
            break;
          default:
            url = "";
        }
        if (!url) return;

        const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) throw new Error("Failed to fetch items");
        const data = await res.json();
        const itemsArray = Array.isArray(data) ? data : data.admins || data.artists || data.festivals || data.publicUsers || data.content || [];
        setItems(itemsArray);
        setFilteredItems(itemsArray);

        if (admin.role === "FESTIVAL_MANAGER" || admin.role === "LINEUP_MANAGER") {
          const [adminRes, artistRes, festivalRes] = await Promise.all([
            fetch("http://localhost:3002/admins", { headers: { Authorization: `Bearer ${token}` } }),
            fetch("http://localhost:3002/artists", { headers: { Authorization: `Bearer ${token}` } }),
            fetch("http://localhost:3002/festivals", { headers: { Authorization: `Bearer ${token}` } }),
          ]);
          setSelectOptions({
            admins: adminRes.ok ? await adminRes.json() : [],
            artists: artistRes.ok ? await artistRes.json() : [],
            festivals: festivalRes.ok ? await festivalRes.json() : [],
          });
        }
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to fetch items");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [admin, token]);

  const handleSearch = (query) => {
    setSearch(query);
    const lowerQuery = query.toLowerCase();
    setFilteredItems(
      items.filter(
        (i) => i.name?.toLowerCase().includes(lowerQuery) || i.username?.toLowerCase().includes(lowerQuery) || i.email?.toLowerCase().includes(lowerQuery)
      )
    );
  };

  const handleAddNew = (type) => {
    setModalType(type);
    setModalData({});
    setSuccess("");
    setError("");
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setModalData({ ...item });
    setModalType(
      admin.role === "FESTIVAL_MANAGER" ? "festival" : admin.role === "ARTIST_MANAGER" ? "artist" : admin.role === "USER_MANAGER" ? "user" : "admin"
    );
    setSuccess("");
    setError("");
    setShowModal(true);
  };

  const handleDelete = async (item) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      let url = "";
      switch (modalType) {
        case "festival":
          url = `http://localhost:3002/festivals/${item.id}`;
          break;
        case "artist":
          url = `http://localhost:3002/artists/${item.id}`;
          break;
        case "user":
          url = `http://localhost:3002/public-users/${item.id}`;
          break;
        case "admin":
          url = `http://localhost:3002/admins/${item.id}`;
          break;
        case "lineup":
          url = `http://localhost:3002/lineups/${item.id}`;
          break;
        default:
          return;
      }
      const res = await fetch(url, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error("Failed to delete item");

      setItems((prev) => prev.filter((i) => i.id !== item.id));
      setFilteredItems((prev) => prev.filter((i) => i.id !== item.id));
      setSuccess("Item deleted successfully");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to delete item");
    }
  };

  const handleModalSubmit = async (formData) => {
    if (!modalType) return;
    setModalLoading(true);
    setSuccess("");
    setError("");

    try {
      let url = "";
      let method = modalData?.id ? "PUT" : "POST";

      switch (modalType) {
        case "festival":
          url = modalData?.id ? `http://localhost:3002/festivals/${modalData.id}` : "http://localhost:3002/festivals/register";
          break;
        case "artist":
          url = modalData?.id ? `http://localhost:3002/artists/${modalData.id}` : "http://localhost:3002/artists/register";
          break;
        case "user":
          if (!modalData?.id) {
            console.warn("Admin cannot create a new public user");
            setModalLoading(false);
            return;
          }
          url = `http://localhost:3002/public-users/${modalData.id}`;
          break;
        case "admin":
          url = modalData?.id ? `http://localhost:3002/admins/${modalData.id}` : "http://localhost:3002/admins/register";
          break;
        case "lineup":
          url = modalData?.id ? `http://localhost:3002/lineups/${modalData.id}` : "http://localhost:3002/lineups/register";
          break;
        default:
          return;
      }

      const fileTypes = ["festival", "artist"];
      const hasFile = fileTypes.includes(modalType) && (formData.coverImg || formData.campingMap);

      let options = { method, headers: { Authorization: `Bearer ${token}` }, body: hasFile ? new FormData() : JSON.stringify(formData) };
      if (hasFile) {
        const fd = new FormData();
        Object.keys(formData).forEach((k) => {
          if (formData[k] != null) fd.append(k, formData[k]);
        });
        options.body = fd;
      } else {
        options.headers["Content-Type"] = "application/json";
      }

      const res = await fetch(url, options);
      if (!res.ok) throw new Error("Failed to save item");
      const savedItem = await res.json();

      if (modalData?.id) {
        setItems((prev) => prev.map((i) => (i.id === savedItem.id ? savedItem : i)));
        setFilteredItems((prev) => prev.map((i) => (i.id === savedItem.id ? savedItem : i)));
        setSuccess("Item updated successfully");
      } else {
        setItems((prev) => [savedItem, ...prev]);
        setFilteredItems((prev) => [savedItem, ...prev]);
        setSuccess("Item added successfully");
      }

      setShowModal(false);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save item");
    } finally {
      setModalLoading(false);
    }
  };

  const getModalFields = () => {
    if (!modalType) return [];
    const data = modalData || {};

    switch (modalType) {
      case "festival":
        return [
          { id: "name", label: "Festival Name", value: data.name || "", onChange: (e) => setModalData({ ...data, name: e.target.value }) },
          { id: "city", label: "City", value: data.city || "", onChange: (e) => setModalData({ ...data, city: e.target.value }) },
          { id: "country", label: "Country", value: data.country || "", onChange: (e) => setModalData({ ...data, country: e.target.value }) },
          {
            id: "startDate",
            label: "Start Date",
            type: "date",
            value: data.startDate || "",
            onChange: (e) => setModalData({ ...data, startDate: e.target.value }),
          },
          { id: "endDate", label: "End Date", type: "date", value: data.endDate || "", onChange: (e) => setModalData({ ...data, endDate: e.target.value }) },
          {
            id: "maxNumbPartecipants",
            label: "Max Participants",
            type: "number",
            value: data.maxNumbPartecipants || "",
            onChange: (e) => setModalData({ ...data, maxNumbPartecipants: e.target.value }),
          },
          {
            id: "dailyPrice",
            label: "Daily Price",
            type: "number",
            step: "0.1",
            value: data.dailyPrice || "",
            onChange: (e) => setModalData({ ...data, dailyPrice: e.target.value }),
          },
          { id: "coverImg", label: "Cover Image", type: "file", value: "", onChange: (e) => setModalData({ ...data, coverImg: e.target.files[0] }) },
          { id: "campingMap", label: "Camping Map", type: "file", value: "", onChange: (e) => setModalData({ ...data, campingMap: e.target.files[0] }) },
          {
            id: "eventPlanner",
            label: "Event Planner",
            type: "select",
            options: selectOptions.admins.map((a) => ({ value: a.id, label: a.username })),
            value: data.eventPlanner?.id || "",
            onChange: (e) => setModalData({ ...data, eventPlanner: { id: e.target.value } }),
          },
        ];
      case "artist":
        return [
          { id: "name", label: "Artist Name", value: data.name || "", onChange: (e) => setModalData({ ...data, name: e.target.value }) },
          {
            id: "genre",
            label: "Genre",
            type: "select",
            options: [
              { value: "ROCK", label: "Rock" },
              { value: "POP", label: "Pop" },
              { value: "JAZZ", label: "Jazz" },
              { value: "ELECTRONIC", label: "Electronic" },
            ],
            value: data.genre || "",
            onChange: (e) => setModalData({ ...data, genre: e.target.value }),
          },
          { id: "link", label: "Link", value: data.link || "", onChange: (e) => setModalData({ ...data, link: e.target.value }) },
          { id: "coverImg", label: "Cover Image", type: "file", value: "", onChange: (e) => setModalData({ ...data, coverImg: e.target.files[0] }) },
        ];
      case "user":
        return [
          { id: "username", label: "Username", value: data.username || "", onChange: (e) => setModalData({ ...data, username: e.target.value }) },
          { id: "name", label: "Name", value: data.name || "", onChange: (e) => setModalData({ ...data, name: e.target.value }) },
          { id: "surname", label: "Surname", value: data.surname || "", onChange: (e) => setModalData({ ...data, surname: e.target.value }) },
          { id: "email", label: "Email", value: data.email || "", onChange: (e) => setModalData({ ...data, email: e.target.value }) },
          { id: "city", label: "City", value: data.city || "", onChange: (e) => setModalData({ ...data, city: e.target.value }) },
          { id: "country", label: "Country", value: data.country || "", onChange: (e) => setModalData({ ...data, country: e.target.value }) },
        ];
      case "admin":
        return [
          { id: "username", label: "Username", value: data.username || "", onChange: (e) => setModalData({ ...data, username: e.target.value }) },
          { id: "name", label: "Name", value: data.name || "", onChange: (e) => setModalData({ ...data, name: e.target.value }) },
          { id: "surname", label: "Surname", value: data.surname || "", onChange: (e) => setModalData({ ...data, surname: e.target.value }) },
          { id: "email", label: "Email", value: data.email || "", onChange: (e) => setModalData({ ...data, email: e.target.value }) },
          {
            id: "password",
            label: "Password",
            type: "password",
            value: data.password || "",
            onChange: (e) => setModalData({ ...data, password: e.target.value }),
          },
          { id: "phoneNumber", label: "Phone Number", value: data.phoneNumber || "", onChange: (e) => setModalData({ ...data, phoneNumber: e.target.value }) },
          {
            id: "role",
            label: "Role",
            type: "select",
            options: [
              { value: "SYSTEM_ADMIN", label: "System Admin" },
              { value: "ARTIST_MANAGER", label: "Artist Manager" },
              { value: "FESTIVAL_MANAGER", label: "Festival Manager" },
              { value: "RESERVATION_MANAGER", label: "Reservation Manager" },
              { value: "USER_MANAGER", label: "User Manager" },
            ],
            value: data.role || "",
            onChange: (e) => setModalData({ ...data, role: e.target.value }),
          },
        ];
      default:
        return [];
    }
  };

  return (
    <Container className="mb-5" style={{ minHeight: "80vh" }}>
      <Row className="align-items-center mb-3">
        <Col xs={12} md={8}>
          <FestiMateSearchbar value={search} onChange={handleSearch} onSearch={handleSearch} />
        </Col>
        <Col xs={12} md={4} className="text-end">
          <FestiMateButton
            onClick={() => {
              const type =
                admin.role === "FESTIVAL_MANAGER" ? "festival" : admin.role === "ARTIST_MANAGER" ? "artist" : admin.role === "USER_MANAGER" ? null : "admin";
              if (!type) return;
              handleAddNew(type);
            }}
          >
            Add New
          </FestiMateButton>
        </Col>
      </Row>

      {loading && <FestiMateSpinner />}
      {!loading && filteredItems.length === 0 && <Alert variant="warning">No items found</Alert>}

      {!loading && filteredItems.length > 0 && (
        <FestiMateListgroup
          items={filteredItems.map((i) => ({
            id: i.id,
            label: (
              <Row className="align-items-center gy-4">
                <Col xs={12} sm={8}>
                  {Object.entries(i).map(([key, value]) => (
                    <div key={key}>
                      <strong>{key}:</strong> {value?.name || value?.username || value?.toString?.() || ""}
                    </div>
                  ))}
                </Col>
                <Col xs={12} sm={4}>
                  <Row className="gy-3">
                    <Col>
                      <FestiMateButton
                        className="me-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(i);
                        }}
                      >
                        Edit
                      </FestiMateButton>
                    </Col>
                    <Col>
                      <FestiMateButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(i);
                        }}
                      >
                        Delete
                      </FestiMateButton>
                    </Col>
                  </Row>
                </Col>
              </Row>
            ),
          }))}
        />
      )}

      <FestiMateModal show={showModal} onClose={() => setShowModal(false)} title={modalData?.id ? "Edit Item" : "Add New Item"}>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <FestiMateForm
          fields={getModalFields()}
          onSubmit={(formData) => handleModalSubmit(formData)}
          loading={modalLoading}
          submitLabel={modalData?.id ? "Save Changes" : "Add Item"}
        />
      </FestiMateModal>
    </Container>
  );
};

export default Backoffice; */
}

{
  /* FUNiONANTE MA SENZA ALERT 
import { useState, useEffect } from "react";
import { Container, Row, Col, Alert } from "react-bootstrap";
import FestiMateSearchbar from "../../components/FestiMateSearchbar";
import FestiMateListgroup from "../../components/FestiMateListgroup";
import FestiMateButton from "../../components/FestiMateButton";
import FestiMateModal from "../../components/FestiMateModal";
import FestiMateForm from "../../components/FestiMateForm";
import FestiMateSpinner from "../../components/FestiMateSpinner";

const Backoffice = ({ user }) => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalData, setModalData] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const [selectOptions, setSelectOptions] = useState({ admins: [], artists: [], festivals: [] });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const admin = user;
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!admin) return;

    const fetchItems = async () => {
      setLoading(true);
      try {
        let url = "";
        switch (admin.role) {
          case "SYSTEM_ADMIN":
            url = "http://localhost:3002/admins";
            break;
          case "ARTIST_MANAGER":
            url = "http://localhost:3002/artists";
            break;
          case "FESTIVAL_MANAGER":
            url = "http://localhost:3002/festivals";
            break;
          case "RESERVATION_MANAGER":
            url = "http://localhost:3002/reservations";
            break;
          case "USER_MANAGER":
            url = "http://localhost:3002/public-users";
            break;
          default:
            url = "";
        }
        if (!url) return;

        const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) throw new Error("Failed to fetch items");
        const data = await res.json();
        const itemsArray = Array.isArray(data) ? data : data.admins || data.artists || data.festivals || data.publicUsers || data.content || [];
        setItems(itemsArray);
        setFilteredItems(itemsArray);

        if (admin.role === "FESTIVAL_MANAGER" || admin.role === "LINEUP_MANAGER") {
          const [adminRes, artistRes, festivalRes] = await Promise.all([
            fetch("http://localhost:3002/admins", { headers: { Authorization: `Bearer ${token}` } }),
            fetch("http://localhost:3002/artists", { headers: { Authorization: `Bearer ${token}` } }),
            fetch("http://localhost:3002/festivals", { headers: { Authorization: `Bearer ${token}` } }),
          ]);
          setSelectOptions({
            admins: adminRes.ok ? await adminRes.json() : [],
            artists: artistRes.ok ? await artistRes.json() : [],
            festivals: festivalRes.ok ? await festivalRes.json() : [],
          });
        }
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to fetch items");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [admin, token]);

  const handleSearch = (query) => {
    setSearch(query);
    const lowerQuery = query.toLowerCase();
    setFilteredItems(
      items.filter(
        (i) => i.name?.toLowerCase().includes(lowerQuery) || i.username?.toLowerCase().includes(lowerQuery) || i.email?.toLowerCase().includes(lowerQuery)
      )
    );
  };

  const handleAddNew = (type) => {
    setModalType(type);
    setModalData({
      role: "SYSTEM_ADMIN",
    });
    setSuccess("");
    setError("");
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setModalData({ ...item });
    const type = admin.role === "FESTIVAL_MANAGER" ? "festival" : admin.role === "ARTIST_MANAGER" ? "artist" : admin.role === "USER_MANAGER" ? "user" : "admin";
    setModalType(type);
    setSuccess("");
    setError("");
    setShowModal(true);
  };

  const handleDelete = async (item) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      let url = "";
      switch (modalType) {
        case "festival":
          url = `http://localhost:3002/festivals/${item.id}`;
          break;
        case "artist":
          url = `http://localhost:3002/artists/${item.id}`;
          break;
        case "user":
          url = `http://localhost:3002/public-users/${item.id}`;
          break;
        case "admin":
          url = `http://localhost:3002/admins/${item.id}`;
          break;
        case "lineup":
          url = `http://localhost:3002/lineups/${item.id}`;
          break;
        default:
          return;
      }
      const res = await fetch(url, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error("Failed to delete item");
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      setFilteredItems((prev) => prev.filter((i) => i.id !== item.id));
      setSuccess("Item deleted successfully");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to delete item");
    }
  };

  const handleModalSubmit = async (formData) => {
    if (!modalType) return;
    setModalLoading(true);
    setSuccess("");
    setError("");

    try {
      let url = "";
      let method = modalData?.id ? "PUT" : "POST";

      switch (modalType) {
        case "festival":
          url = modalData?.id ? `http://localhost:3002/festivals/${modalData.id}` : "http://localhost:3002/festivals/register";
          break;
        case "artist":
          url = modalData?.id ? `http://localhost:3002/artists/${modalData.id}` : "http://localhost:3002/artists/register";
          break;
        case "user":
          if (!modalData?.id) {
            console.warn("Admin cannot create a new public user");
            setModalLoading(false);
            return;
          }
          url = `http://localhost:3002/public-users/${modalData.id}`;
          break;
        case "admin":
          url = modalData?.id ? `http://localhost:3002/admins/${modalData.id}` : "http://localhost:3002/admins/register";
          break;
        case "lineup":
          url = modalData?.id ? `http://localhost:3002/lineups/${modalData.id}` : "http://localhost:3002/lineups/register";
          break;
        default:
          return;
      }

      let options = { method, headers: { Authorization: `Bearer ${token}` } };

      if (modalType === "admin") {
        const payload = {
          username: formData.username,
          name: formData.name,
          surname: formData.surname,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          role: formData.role,
          ...(formData.password && !modalData.id ? { password: formData.password } : {}), // password solo per nuovi admin
        };
        options.headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(payload);
      } else {
        const fileTypes = ["festival", "artist"];
        const hasFile = fileTypes.includes(modalType) && (formData.coverImg || formData.campingMap);
        if (hasFile) {
          const fd = new FormData();
          Object.keys(formData).forEach((k) => {
            if (formData[k] != null) fd.append(k, formData[k]);
          });
          options.body = fd;
        } else {
          options.headers["Content-Type"] = "application/json";
          options.body = JSON.stringify(formData);
        }
      }

      const res = await fetch(url, options);
      if (!res.ok) throw new Error("Failed to save item");
      const savedItem = await res.json();

      if (modalData?.id) {
        setItems((prev) => prev.map((i) => (i.id === savedItem.id ? savedItem : i)));
        setFilteredItems((prev) => prev.map((i) => (i.id === savedItem.id ? savedItem : i)));
        setSuccess("Item updated successfully");
      } else {
        setItems((prev) => [savedItem, ...prev]);
        setFilteredItems((prev) => [savedItem, ...prev]);
        setSuccess("Item added successfully");
      }

      setShowModal(false);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save item");
    } finally {
      setModalLoading(false);
    }
  };

  const getModalFields = () => {
    if (!modalType) return [];
    const data = modalData || {};

    switch (modalType) {
      case "festival":
        return [
          { id: "name", label: "Festival Name", value: data.name || "", onChange: (e) => setModalData({ ...data, name: e.target.value }) },
          { id: "city", label: "City", value: data.city || "", onChange: (e) => setModalData({ ...data, city: e.target.value }) },
          { id: "country", label: "Country", value: data.country || "", onChange: (e) => setModalData({ ...data, country: e.target.value }) },
          {
            id: "startDate",
            label: "Start Date",
            type: "date",
            value: data.startDate || "",
            onChange: (e) => setModalData({ ...data, startDate: e.target.value }),
          },
          { id: "endDate", label: "End Date", type: "date", value: data.endDate || "", onChange: (e) => setModalData({ ...data, endDate: e.target.value }) },
          {
            id: "maxNumbPartecipants",
            label: "Max Participants",
            type: "number",
            value: data.maxNumbPartecipants || "",
            onChange: (e) => setModalData({ ...data, maxNumbPartecipants: e.target.value }),
          },
          {
            id: "dailyPrice",
            label: "Daily Price",
            type: "number",
            step: "0.1",
            value: data.dailyPrice || "",
            onChange: (e) => setModalData({ ...data, dailyPrice: e.target.value }),
          },
          { id: "coverImg", label: "Cover Image", type: "file", value: "", onChange: (e) => setModalData({ ...data, coverImg: e.target.files[0] }) },
          { id: "campingMap", label: "Camping Map", type: "file", value: "", onChange: (e) => setModalData({ ...data, campingMap: e.target.files[0] }) },
          {
            id: "eventPlanner",
            label: "Event Planner",
            type: "select",
            options: selectOptions.admins.map((a) => ({ value: a.id, label: a.username })),
            value: data.eventPlanner?.id || "",
            onChange: (e) => setModalData({ ...data, eventPlanner: { id: e.target.value } }),
          },
        ];
      case "artist":
        return [
          { id: "name", label: "Artist Name", value: data.name || "", onChange: (e) => setModalData({ ...data, name: e.target.value }) },
          {
            id: "genre",
            label: "Genre",
            type: "select",
            options: [
              { value: "ROCK", label: "Rock" },
              { value: "POP", label: "Pop" },
              { value: "JAZZ", label: "Jazz" },
              { value: "ELECTRONIC", label: "Electronic" },
            ],
            value: data.genre || "",
            onChange: (e) => setModalData({ ...data, genre: e.target.value }),
          },
          { id: "link", label: "Link", value: data.link || "", onChange: (e) => setModalData({ ...data, link: e.target.value }) },
          { id: "coverImg", label: "Cover Image", type: "file", value: "", onChange: (e) => setModalData({ ...data, coverImg: e.target.files[0] }) },
        ];
      case "user":
        return [
          { id: "username", label: "Username", value: data.username || "", onChange: (e) => setModalData({ ...data, username: e.target.value }) },
          { id: "name", label: "Name", value: data.name || "", onChange: (e) => setModalData({ ...data, name: e.target.value }) },
          { id: "surname", label: "Surname", value: data.surname || "", onChange: (e) => setModalData({ ...data, surname: e.target.value }) },
          { id: "email", label: "Email", value: data.email || "", onChange: (e) => setModalData({ ...data, email: e.target.value }) },
          { id: "city", label: "City", value: data.city || "", onChange: (e) => setModalData({ ...data, city: e.target.value }) },
          { id: "country", label: "Country", value: data.country || "", onChange: (e) => setModalData({ ...data, country: e.target.value }) },
        ];
      case "admin":
        return [
          { id: "username", label: "Username", value: data.username || "", onChange: (e) => setModalData({ ...data, username: e.target.value }) },
          { id: "name", label: "Name", value: data.name || "", onChange: (e) => setModalData({ ...data, name: e.target.value }) },
          { id: "surname", label: "Surname", value: data.surname || "", onChange: (e) => setModalData({ ...data, surname: e.target.value }) },
          { id: "email", label: "Email", value: data.email || "", onChange: (e) => setModalData({ ...data, email: e.target.value }) },
          ...(!data.id
            ? [
                {
                  id: "password",
                  label: "Password",
                  type: "password",
                  value: data.password || "",
                  onChange: (e) => setModalData({ ...data, password: e.target.value }),
                },
              ]
            : []),
          { id: "phoneNumber", label: "Phone Number", value: data.phoneNumber || "", onChange: (e) => setModalData({ ...data, phoneNumber: e.target.value }) },
          {
            id: "role",
            label: "Role",
            type: "select",
            options: [
              { value: "SYSTEM_ADMIN", label: "System Admin" },
              { value: "ARTIST_MANAGER", label: "Artist Manager" },
              { value: "FESTIVAL_MANAGER", label: "Festival Manager" },
              { value: "RESERVATION_MANAGER", label: "Reservation Manager" },
              { value: "USER_MANAGER", label: "User Manager" },
            ],
            value: data.role || "",
            onChange: (e) => setModalData({ ...data, role: e.target.value }),
          },
        ];
      default:
        return [];
    }
  };

  return (
    <Container className="mb-5" style={{ minHeight: "80vh" }}>
      <Row className="align-items-center mb-3">
        <Col xs={12} md={8}>
          <FestiMateSearchbar value={search} onChange={handleSearch} onSearch={handleSearch} />
        </Col>
        <Col xs={12} md={4} className="text-end">
          <FestiMateButton
            onClick={() => {
              const type =
                admin.role === "FESTIVAL_MANAGER" ? "festival" : admin.role === "ARTIST_MANAGER" ? "artist" : admin.role === "USER_MANAGER" ? null : "admin";
              if (!type) return;
              handleAddNew(type);
            }}
          >
            Add New
          </FestiMateButton>
        </Col>
      </Row>

      {loading && <FestiMateSpinner />}
      {!loading && filteredItems.length === 0 && <Alert variant="warning">No items found</Alert>}

      {!loading && filteredItems.length > 0 && (
        <FestiMateListgroup
          items={filteredItems.map((i) => ({
            id: i.id,
            label: (
              <Row className="align-items-center gy-4">
                <Col xs={12} sm={8}>
                  {Object.entries(i).map(([key, value]) => (
                    <div key={key}>
                      <strong>{key}:</strong> {value?.name || value?.username || value?.toString?.() || ""}
                    </div>
                  ))}
                </Col>
                <Col xs={12} sm={4}>
                  <Row className="gy-3">
                    <Col>
                      <FestiMateButton
                        className="me-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(i);
                        }}
                      >
                        Edit
                      </FestiMateButton>
                    </Col>
                    <Col>
                      <FestiMateButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(i);
                        }}
                      >
                        Delete
                      </FestiMateButton>
                    </Col>
                  </Row>
                </Col>
              </Row>
            ),
          }))}
        />
      )}

      <FestiMateModal show={showModal} onClose={() => setShowModal(false)} title={modalData?.id ? "Edit Item" : "Add New Item"}>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <FestiMateForm
          fields={getModalFields()}
          onSubmit={(formData) => handleModalSubmit(formData)}
          loading={modalLoading}
          submitLabel={modalData?.id ? "Save Changes" : "Create"}
        />
      </FestiMateModal>
    </Container>
  );
};

export default Backoffice;
*/
}
{
  /*
import { useState, useEffect } from "react";
import { Container, Row, Col, Alert } from "react-bootstrap";
import FestiMateSearchbar from "../../components/FestiMateSearchbar";
import FestiMateListgroup from "../../components/FestiMateListgroup";
import FestiMateButton from "../../components/FestiMateButton";
import FestiMateModal from "../../components/FestiMateModal";
import FestiMateForm from "../../components/FestiMateForm";
import FestiMateSpinner from "../../components/FestiMateSpinner";
import FestiMateDropdown from "../../components/FestiMateDropdown";

const Backoffice = ({ user }) => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalData, setModalData] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const [selectOptions, setSelectOptions] = useState({ admins: [], artists: [], festivals: [] });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const admin = user;
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!admin) return;

    const fetchItems = async () => {
      setLoading(true);
      try {
        let url = "";
        switch (admin.role) {
          case "SYSTEM_ADMIN":
            url = "http://localhost:3002/admins";
            break;
          case "ARTIST_MANAGER":
            url = "http://localhost:3002/artists";
            break;
          case "FESTIVAL_MANAGER":
            url = "http://localhost:3002/festivals";
            break;
          case "RESERVATION_MANAGER":
            url = "http://localhost:3002/reservations";
            break;
          case "USER_MANAGER":
            url = "http://localhost:3002/public-users";
            break;
          default:
            url = "";
        }
        if (!url) return;

        const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) throw new Error("Failed to fetch items");
        const data = await res.json();
        const itemsArray = Array.isArray(data) ? data : data.admins || data.artists || data.festivals || data.publicUsers || data.content || [];
        setItems(itemsArray);
        setFilteredItems(itemsArray);

        if (admin.role === "FESTIVAL_MANAGER" || admin.role === "LINEUP_MANAGER") {
          const [adminRes, artistRes, festivalRes] = await Promise.all([
            fetch("http://localhost:3002/admins", { headers: { Authorization: `Bearer ${token}` } }),
            fetch("http://localhost:3002/artists", { headers: { Authorization: `Bearer ${token}` } }),
            fetch("http://localhost:3002/festivals", { headers: { Authorization: `Bearer ${token}` } }),
          ]);
          setSelectOptions({
            admins: adminRes.ok ? await adminRes.json() : [],
            artists: artistRes.ok ? await artistRes.json() : [],
            festivals: festivalRes.ok ? await festivalRes.json() : [],
          });
        }
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to fetch items");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [admin, token]);

  const handleSearch = (query) => {
    setSearch(query);
    const lowerQuery = query.toLowerCase();
    setFilteredItems(
      items.filter(
        (i) => i.name?.toLowerCase().includes(lowerQuery) || i.username?.toLowerCase().includes(lowerQuery) || i.email?.toLowerCase().includes(lowerQuery)
      )
    );
  };

  const handleAddNew = (type) => {
    setModalType(type);
    setModalData({
      role: "SYSTEM_ADMIN",
    });
    setSuccess("");
    setError("");
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setModalData({ ...item });
    const type = admin.role === "FESTIVAL_MANAGER" ? "festival" : admin.role === "ARTIST_MANAGER" ? "artist" : admin.role === "USER_MANAGER" ? "user" : "admin";
    setModalType(type);
    setSuccess("");
    setError("");
    setShowModal(true);
  };

  const handleDelete = async (item) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      let url = "";
      switch (modalType) {
        case "festival":
          url = `http://localhost:3002/festivals/${item.id}`;
          break;
        case "artist":
          url = `http://localhost:3002/artists/${item.id}`;
          break;
        case "user":
          url = `http://localhost:3002/public-users/${item.id}`;
          break;
        case "admin":
          url = `http://localhost:3002/admins/${item.id}`;
          break;
        case "lineup":
          url = `http://localhost:3002/lineups/${item.id}`;
          break;
        default:
          return;
      }
      const res = await fetch(url, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error("Failed to delete item");
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      setFilteredItems((prev) => prev.filter((i) => i.id !== item.id));
      setSuccess("Item deleted successfully");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to delete item");
    }
  };

  const handleModalSubmit = async (formData) => {
    if (!modalType) return;
    setModalLoading(true);
    setSuccess("");
    setError("");

    try {
      let url = "";
      let method = modalData?.id ? "PUT" : "POST";

      switch (modalType) {
        case "festival":
          url = modalData?.id ? `http://localhost:3002/festivals/${modalData.id}` : "http://localhost:3002/festivals/register";
          break;
        case "artist":
          url = modalData?.id ? `http://localhost:3002/artists/${modalData.id}` : "http://localhost:3002/artists/register";
          break;
        case "user":
          if (!modalData?.id) {
            console.warn("Admin cannot create a new public user");
            setModalLoading(false);
            return;
          }
          url = `http://localhost:3002/public-users/${modalData.id}`;
          break;
        case "admin":
          url = modalData?.id ? `http://localhost:3002/admins/${modalData.id}` : "http://localhost:3002/admins/register";
          break;
        case "lineup":
          url = modalData?.id ? `http://localhost:3002/lineups/${modalData.id}` : "http://localhost:3002/lineups/register";
          break;
        default:
          return;
      }

      let options = { method, headers: { Authorization: `Bearer ${token}` } };

      if (modalType === "admin") {
        const payload = {
          username: formData.username,
          name: formData.name,
          surname: formData.surname,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          role: formData.role,
          ...(formData.password && !modalData?.id ? { password: formData.password } : {}), // password solo per nuovi admin
        };
        options.headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(payload);
      } else {
        const fileTypes = ["festival", "artist"];
        const hasFile = fileTypes.includes(modalType) && (formData.coverImg || formData.campingMap);
        if (hasFile) {
          const fd = new FormData();
          Object.keys(formData).forEach((k) => {
            if (formData[k] != null) fd.append(k, formData[k]);
          });
          options.body = fd;
        } else {
          options.headers["Content-Type"] = "application/json";
          options.body = JSON.stringify(formData);
        }
      }

      const res = await fetch(url, options);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to save item (${res.status})`);
      }
      const savedItem = await res.json();

      if (modalData?.id) {
        setItems((prev) => prev.map((i) => (i.id === savedItem.id ? savedItem : i)));
        setFilteredItems((prev) => prev.map((i) => (i.id === savedItem.id ? savedItem : i)));
        setSuccess("Item updated successfully");
        setModalData(savedItem);
      } else {
        setItems((prev) => [savedItem, ...prev]);
        setFilteredItems((prev) => [savedItem, ...prev]);
        setSuccess("Item added successfully");
        setModalData(savedItem);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save item");
    } finally {
      setModalLoading(false);
    }
  };

  const getModalFields = () => {
    if (!modalType) return [];
    const data = modalData || {};

    switch (modalType) {
      case "festival":
        return [
          { id: "name", label: "Festival Name", value: data.name || "", onChange: (e) => setModalData({ ...data, name: e.target.value }) },
          { id: "city", label: "City", value: data.city || "", onChange: (e) => setModalData({ ...data, city: e.target.value }) },
          { id: "country", label: "Country", value: data.country || "", onChange: (e) => setModalData({ ...data, country: e.target.value }) },
          {
            id: "startDate",
            label: "Start Date",
            type: "date",
            value: data.startDate || "",
            onChange: (e) => setModalData({ ...data, startDate: e.target.value }),
          },
          { id: "endDate", label: "End Date", type: "date", value: data.endDate || "", onChange: (e) => setModalData({ ...data, endDate: e.target.value }) },
          {
            id: "maxNumbPartecipants",
            label: "Max Participants",
            type: "number",
            value: data.maxNumbPartecipants || "",
            onChange: (e) => setModalData({ ...data, maxNumbPartecipants: e.target.value }),
          },
          {
            id: "dailyPrice",
            label: "Daily Price",
            type: "number",
            step: "0.1",
            value: data.dailyPrice || "",
            onChange: (e) => setModalData({ ...data, dailyPrice: e.target.value }),
          },
          { id: "coverImg", label: "Cover Image", type: "file", onChange: (e) => setModalData({ ...data, coverImg: e.target.files[0] }) },
          { id: "campingMap", label: "Camping Map", type: "file", onChange: (e) => setModalData({ ...data, campingMap: e.target.files[0] }) },
          {
            id: "eventPlanner",
            label: "Event Planner",
            type: "select",
            options: selectOptions.admins.map((a) => ({ value: a.id, label: a.username })),
            value: data.eventPlanner?.id || "",
            onChange: (e) => setModalData({ ...data, eventPlanner: { id: e.target.value } }),
          },
        ];
      case "artist":
        return [
          { id: "name", label: "Artist Name", value: data.name || "", onChange: (e) => setModalData({ ...data, name: e.target.value }) },
          {
            id: "genre",
            label: "Genre",
            customComponent: <FestiMateDropdown value={data.genre || ""} onChange={(genre) => setModalData({ ...data, genre })} />,
          },
          { id: "link", label: "Link", value: data.link || "", onChange: (e) => setModalData({ ...data, link: e.target.value }) },
          { id: "coverImg", label: "Cover Image", type: "file", onChange: (e) => setModalData({ ...data, coverImg: e.target.files[0] }) },
        ];
      case "user":
        return [
          { id: "username", label: "Username", value: data.username || "", onChange: (e) => setModalData({ ...data, username: e.target.value }) },
          { id: "name", label: "Name", value: data.name || "", onChange: (e) => setModalData({ ...data, name: e.target.value }) },
          { id: "surname", label: "Surname", value: data.surname || "", onChange: (e) => setModalData({ ...data, surname: e.target.value }) },
          { id: "email", label: "Email", value: data.email || "", onChange: (e) => setModalData({ ...data, email: e.target.value }) },
          { id: "city", label: "City", value: data.city || "", onChange: (e) => setModalData({ ...data, city: e.target.value }) },
          { id: "country", label: "Country", value: data.country || "", onChange: (e) => setModalData({ ...data, country: e.target.value }) },
        ];
      case "admin":
        return [
          { id: "username", label: "Username", value: data.username || "", onChange: (e) => setModalData({ ...data, username: e.target.value }) },
          { id: "name", label: "Name", value: data.name || "", onChange: (e) => setModalData({ ...data, name: e.target.value }) },
          { id: "surname", label: "Surname", value: data.surname || "", onChange: (e) => setModalData({ ...data, surname: e.target.value }) },
          { id: "email", label: "Email", value: data.email || "", onChange: (e) => setModalData({ ...data, email: e.target.value }) },

          ...(!data?.id
            ? [
                {
                  id: "password",
                  label: "Password",
                  type: "password",
                  value: data.password || "",
                  onChange: (e) => setModalData({ ...data, password: e.target.value }),
                },
              ]
            : []),
          { id: "phoneNumber", label: "Phone Number", value: data.phoneNumber || "", onChange: (e) => setModalData({ ...data, phoneNumber: e.target.value }) },
          {
            id: "role",
            label: "Role",
            type: "select",
            options: [
              { value: "SYSTEM_ADMIN", label: "System Admin" },
              { value: "ARTIST_MANAGER", label: "Artist Manager" },
              { value: "FESTIVAL_MANAGER", label: "Festival Manager" },
              { value: "RESERVATION_MANAGER", label: "Reservation Manager" },
              { value: "USER_MANAGER", label: "User Manager" },
            ],
            value: data.role || "",
            onChange: (e) => setModalData({ ...data, role: e.target.value }),
          },
        ];
      default:
        return [];
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSuccess("");
    setError("");
    setModalData(null);
    setModalType("");
  };

  return (
    <Container className="mb-5" style={{ minHeight: "80vh" }}>
      <Row className="align-items-center mb-3">
        <Col xs={12} md={8}>
          <FestiMateSearchbar value={search} onChange={handleSearch} onSearch={handleSearch} />
        </Col>
        <Col xs={12} md={4} className="text-end">
          <FestiMateButton
            onClick={() => {
              const type =
                admin.role === "FESTIVAL_MANAGER" ? "festival" : admin.role === "ARTIST_MANAGER" ? "artist" : admin.role === "USER_MANAGER" ? null : "admin";
              if (!type) return;
              handleAddNew(type);
            }}
          >
            Add New
          </FestiMateButton>
        </Col>
      </Row>

      {loading && <FestiMateSpinner />}
      {!loading && filteredItems.length === 0 && <Alert variant="warning">No items found</Alert>}

      {!loading && filteredItems.length > 0 && (
        <FestiMateListgroup
          items={filteredItems.map((i) => ({
            id: i.id,
            label: (
              <Row className="align-items-center gy-4">
                <Col xs={12} sm={8}>
                  {Object.entries(i).map(([key, value]) => (
                    <div key={key}>
                      <strong>{key}:</strong> {value?.name || value?.username || value?.toString?.() || ""}
                    </div>
                  ))}
                </Col>
                <Col xs={12} sm={4}>
                  <Row className="gy-3">
                    <Col>
                      <FestiMateButton
                        className="me-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(i);
                        }}
                      >
                        Edit
                      </FestiMateButton>
                    </Col>
                    <Col>
                      <FestiMateButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(i);
                        }}
                      >
                        Delete
                      </FestiMateButton>
                    </Col>
                  </Row>
                </Col>
              </Row>
            ),
          }))}
        />
      )}

      <FestiMateModal show={showModal} onClose={handleCloseModal} title={modalData?.id ? "Edit Item" : "Add New Item"}>
        {error && (
          <Alert variant="danger" className="my-2">
            {error}
          </Alert>
        )}
        {success && (
          <Alert variant="success" className="my-2">
            {success}
          </Alert>
        )}
        <FestiMateForm
          fields={getModalFields()}
          onSubmit={(formData) => handleModalSubmit(formData)}
          loading={modalLoading}
          submitLabel={modalData?.id ? "Save Changes" : "Create"}
        />
      </FestiMateModal>
    </Container>
  );
};

export default Backoffice;
*/
}

//FUNZIONA PER SYSTEM_ADMIN e basta ahahahahhahah
import { useState, useEffect } from "react";
import { Container, Row, Col, Alert } from "react-bootstrap";
import FestiMateSearchbar from "../../components/FestiMateSearchbar";
import FestiMateListgroup from "../../components/FestiMateListgroup";
import FestiMateButton from "../../components/FestiMateButton";
import FestiMateModal from "../../components/FestiMateModal";
import FestiMateForm from "../../components/FestiMateForm";
import FestiMateSpinner from "../../components/FestiMateSpinner";
import FestiMateDropdown from "../../components/FestiMateDropdown";

const Backoffice = ({ user }) => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalData, setModalData] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const admin = user;
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!admin) return;

    const fetchItems = async () => {
      setLoading(true);
      try {
        let url = "";
        switch (admin.role) {
          case "SYSTEM_ADMIN":
            url = "http://localhost:3002/admins";
            break;
          case "ARTIST_MANAGER":
            url = "http://localhost:3002/artists";
            break;
          case "FESTIVAL_MANAGER":
            url = "http://localhost:3002/festivals";
            break;
          case "RESERVATION_MANAGER":
            url = "http://localhost:3002/reservations";
            break;
          case "USER_MANAGER":
            url = "http://localhost:3002/public-users";
            break;
          default:
            url = "";
        }
        if (!url) return;

        const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) throw new Error("Failed to fetch items");
        const data = await res.json();
        const itemsArray = Array.isArray(data) || data.admins || data.artists || data.festivals || data.publicUsers || data.content || [];
        setItems(itemsArray);
        setFilteredItems(itemsArray);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to fetch items");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [admin, token]);

  const handleSearch = (query) => {
    setSearch(query);
    const lowerQuery = query.toLowerCase();

    if (admin.role === "RESERVATION_MANAGER") {
      setFilteredItems(
        items.filter(
          (i) => i.festivalId?.toString().includes(lowerQuery) || i.userId?.toString().includes(lowerQuery) || i.campingId?.toString().includes(lowerQuery)
        )
      );
    } else {
      setFilteredItems(
        items.filter(
          (i) => i.name?.toLowerCase().includes(lowerQuery) || i.username?.toLowerCase().includes(lowerQuery) || i.email?.toLowerCase().includes(lowerQuery)
        )
      );
    }
  };

  const handleAddNew = (type) => {
    setModalType(type);
    setModalData({
      role: "SYSTEM_ADMIN",
    });
    setSuccess("");
    setError("");
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setModalData({ ...item });
    const type = (() => {
      switch (admin.role) {
        case "SYSTEM_ADMIN":
          return "admin";
        case "FESTIVAL_MANAGER":
          return item.lineupId ? "lineup" : "festival";
        case "ARTIST_MANAGER":
          return "artist";
        case "USER_MANAGER":
          return "user";
        case "RESERVATION_MANAGER":
          return null;
        default:
          return null;
      }
    })();
    if (!type) return;
    setModalType(type);
    setSuccess("");
    setError("");
    setShowModal(true);
  };

  const handleDelete = async (item) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      let url = "";
      switch (modalType) {
        case "festival":
          url = `http://localhost:3002/festivals/${item.id}`;
          break;
        case "artist":
          url = `http://localhost:3002/artists/${item.id}`;
          break;
        case "user":
          url = `http://localhost:3002/public-users/${item.id}`;
          break;
        case "admin":
          url = `http://localhost:3002/admins/${item.id}`;
          break;
        case "lineup":
          url = `http://localhost:3002/lineups/${item.id}`;
          break;
        case "reservation":
          url = `http://localhost:3002/reservations/${item.id}`;
          break;
        default:
          return;
      }
      const res = await fetch(url, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error("Failed to delete item");
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      setFilteredItems((prev) => prev.filter((i) => i.id !== item.id));
      setSuccess("Item deleted successfully");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to delete item");
    }
  };

  const handleModalSubmit = async (formData) => {
    if (!modalType) return;
    setModalLoading(true);
    setSuccess("");
    setError("");

    try {
      let url = "";
      let method = modalData?.id ? "PUT" : "POST";

      switch (modalType) {
        case "festival":
          url = modalData?.id ? `http://localhost:3002/festivals/${modalData.id}` : "http://localhost:3002/festivals/register";
          break;
        case "artist":
          url = modalData?.id ? `http://localhost:3002/artists/${modalData.id}` : "http://localhost:3002/artists/register";
          break;
        case "user":
          if (!modalData?.id) {
            console.warn("Admin cannot create a new public user");
            setModalLoading(false);
            return;
          }
          url = `http://localhost:3002/public-users/${modalData.id}`;
          break;
        case "admin":
          url = modalData?.id ? `http://localhost:3002/admins/${modalData.id}` : "http://localhost:3002/admins/register";
          break;
        case "lineup":
          url = modalData?.id ? `http://localhost:3002/lineups/${modalData.id}` : "http://localhost:3002/lineups/register";
          break;
        default:
          return;
      }

      let options = { method, headers: { Authorization: `Bearer ${token}` } };

      if (modalType === "admin") {
        const payload = {
          username: formData.username,
          name: formData.name,
          surname: formData.surname,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          role: formData.role,
          ...(formData.password && !modalData?.id ? { password: formData.password } : {}),
        };
        options.headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(payload);
      } else {
        const fileTypes = ["festival", "artist"];
        const hasFile = fileTypes.includes(modalType) && (formData.coverImg || formData.campingMap);
        if (hasFile) {
          const fd = new FormData();
          Object.keys(formData).forEach((k) => {
            if (formData[k] != null) fd.append(k, formData[k]);
          });
          options.body = fd;
        } else {
          options.headers["Content-Type"] = "application/json";
          options.body = JSON.stringify(formData);
        }
      }

      const res = await fetch(url, options);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to save item (${res.status})`);
      }
      const savedItem = await res.json();

      if (modalData?.id) {
        setItems((prev) => prev.map((i) => (i.id === savedItem.id ? savedItem : i)));
        setFilteredItems((prev) => prev.map((i) => (i.id === savedItem.id ? savedItem : i)));
        setSuccess("Item updated successfully");
        setModalData(savedItem);
      } else {
        setItems((prev) => [savedItem, ...prev]);
        setFilteredItems((prev) => [savedItem, ...prev]);
        setSuccess("Item added successfully");
        setModalData(savedItem);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save item");
    } finally {
      setModalLoading(false);
    }
  };

  const getModalFields = () => {
    if (!modalType) return [];
    const data = modalData || {};

    switch (modalType) {
      case "festival":
        return [
          { id: "name", label: "Festival Name", value: data.name || "", onChange: (e) => setModalData({ ...data, name: e.target.value }) },
          { id: "city", label: "City", value: data.city || "", onChange: (e) => setModalData({ ...data, city: e.target.value }) },
          { id: "country", label: "Country", value: data.country || "", onChange: (e) => setModalData({ ...data, country: e.target.value }) },
          {
            id: "startDate",
            label: "Start Date",
            type: "date",
            value: data.startDate || "",
            onChange: (e) => setModalData({ ...data, startDate: e.target.value }),
          },
          { id: "endDate", label: "End Date", type: "date", value: data.endDate || "", onChange: (e) => setModalData({ ...data, endDate: e.target.value }) },
          {
            id: "maxNumbPartecipants",
            label: "Max Participants",
            type: "number",
            value: data.maxNumbPartecipants || "",
            onChange: (e) => setModalData({ ...data, maxNumbPartecipants: e.target.value }),
          },
          {
            id: "dailyPrice",
            label: "Daily Price",
            type: "number",
            step: "0.1",
            value: data.dailyPrice || "",
            onChange: (e) => setModalData({ ...data, dailyPrice: e.target.value }),
          },
          { id: "coverImg", label: "Cover Image", type: "file", onChange: (e) => setModalData({ ...data, coverImg: e.target.files[0] }) },
          { id: "campingMap", label: "Camping Map", type: "file", onChange: (e) => setModalData({ ...data, campingMap: e.target.files[0] }) },
          { id: "eventPlanner", label: "Event Planner", type: "text", value: admin.id, onChange: () => {}, disabled: true },
        ];
      case "artist":
        return [
          { id: "name", label: "Artist Name", value: data.name || "", onChange: (e) => setModalData({ ...data, name: e.target.value }) },
          {
            id: "genre",
            label: "Genre",
            customComponent: <FestiMateDropdown value={data.genre || "POP"} onChange={(genre) => setModalData({ ...data, genre })} />,
          },
          { id: "link", label: "Link", value: data.link || "", onChange: (e) => setModalData({ ...data, link: e.target.value }) },
          { id: "coverImg", label: "Cover Image", type: "file", onChange: (e) => setModalData({ ...data, coverImg: e.target.files[0] }) },
        ];
      case "user":
        return [
          { id: "username", label: "Username", value: data.username || "", onChange: (e) => setModalData({ ...data, username: e.target.value }) },
          { id: "name", label: "Name", value: data.name || "", onChange: (e) => setModalData({ ...data, name: e.target.value }) },
          { id: "surname", label: "Surname", value: data.surname || "", onChange: (e) => setModalData({ ...data, surname: e.target.value }) },
          { id: "email", label: "Email", value: data.email || "", onChange: (e) => setModalData({ ...data, email: e.target.value }) },
          { id: "city", label: "City", value: data.city || "", onChange: (e) => setModalData({ ...data, city: e.target.value }) },
          { id: "country", label: "Country", value: data.country || "", onChange: (e) => setModalData({ ...data, country: e.target.value }) },
        ];
      case "admin":
        return [
          { id: "username", label: "Username", value: data.username || "", onChange: (e) => setModalData({ ...data, username: e.target.value }) },
          { id: "name", label: "Name", value: data.name || "", onChange: (e) => setModalData({ ...data, name: e.target.value }) },
          { id: "surname", label: "Surname", value: data.surname || "", onChange: (e) => setModalData({ ...data, surname: e.target.value }) },
          { id: "email", label: "Email", value: data.email || "", onChange: (e) => setModalData({ ...data, email: e.target.value }) },
          ...(!data?.id
            ? [
                {
                  id: "password",
                  label: "Password",
                  type: "password",
                  value: data.password || "",
                  onChange: (e) => setModalData({ ...data, password: e.target.value }),
                },
              ]
            : []),
          { id: "phoneNumber", label: "Phone Number", value: data.phoneNumber || "", onChange: (e) => setModalData({ ...data, phoneNumber: e.target.value }) },
          {
            id: "role",
            label: "Role",
            type: "select",
            options: [
              { value: "SYSTEM_ADMIN", label: "System Admin" },
              { value: "ARTIST_MANAGER", label: "Artist Manager" },
              { value: "FESTIVAL_MANAGER", label: "Festival Manager" },
              { value: "RESERVATION_MANAGER", label: "Reservation Manager" },
              { value: "USER_MANAGER", label: "User Manager" },
            ],
            value: data.role || "",
            onChange: (e) => setModalData({ ...data, role: e.target.value }),
          },
        ];
      case "reservation":
        return [
          { id: "festivalId", label: "Festival ID", value: data.festivalId || "", disabled: true },
          { id: "userId", label: "User ID", value: data.userId || "", disabled: true },
          { id: "campingId", label: "Camping ID", value: data.campingId || "", disabled: true },
          { id: "startDate", label: "Start Date", value: data.startDate || "", disabled: true },
          { id: "endDate", label: "End Date", value: data.endDate || "", disabled: true },
        ];
      default:
        return [];
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSuccess("");
    setError("");
    setModalData(null);
    setModalType("");
  };

  return (
    <Container className="mb-5" style={{ minHeight: "80vh" }}>
      <Row className="align-items-center mb-3">
        <Col xs={12} md={8}>
          <FestiMateSearchbar value={search} onChange={handleSearch} onSearch={handleSearch} />
        </Col>
        <Col xs={12} md={4} className="text-end">
          <FestiMateButton
            onClick={() => {
              const type = (() => {
                switch (admin.role) {
                  case "SYSTEM_ADMIN":
                    return "admin";
                  case "FESTIVAL_MANAGER":
                    return "festival";
                  case "ARTIST_MANAGER":
                    return "artist";
                  case "USER_MANAGER":
                    return null;
                  case "RESERVATION_MANAGER":
                    return null;
                  default:
                    return null;
                }
              })();

              if (!type) return;
              handleAddNew(type);
            }}
          >
            Add New
          </FestiMateButton>
        </Col>
      </Row>

      {loading && <FestiMateSpinner />}
      {!loading && filteredItems.length === 0 && <Alert variant="warning">No items found</Alert>}

      {!loading && filteredItems.length > 0 && (
        <FestiMateListgroup
          items={filteredItems.map((i) => ({
            id: i.id,
            label: (
              <Row className="align-items-center gy-4">
                <Col xs={12} sm={8}>
                  {Object.entries(i).map(([key, value]) => (
                    <div key={key}>
                      <strong>{key}:</strong> {value?.name || value?.username || value?.toString?.() || ""}
                    </div>
                  ))}
                </Col>
                <Col xs={12} sm={4}>
                  <Row className="gy-3">
                    <Col>
                      <FestiMateButton
                        className="me-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(i);
                        }}
                      >
                        Edit
                      </FestiMateButton>
                    </Col>
                    <Col>
                      <FestiMateButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(i);
                        }}
                      >
                        Delete
                      </FestiMateButton>
                    </Col>
                  </Row>
                </Col>
              </Row>
            ),
          }))}
        />
      )}

      <FestiMateModal show={showModal} onClose={handleCloseModal} title={modalData?.id ? "Edit Item" : "Add New Item"}>
        {error && (
          <Alert variant="danger" className="my-2">
            {error}
          </Alert>
        )}
        {success && (
          <Alert variant="success" className="my-2">
            {success}
          </Alert>
        )}
        <FestiMateForm
          fields={getModalFields()}
          onSubmit={(formData) => handleModalSubmit(formData)}
          loading={modalLoading}
          submitLabel={modalData?.id ? "Save Changes" : "Create"}
        />
      </FestiMateModal>
    </Container>
  );
};

export default Backoffice;
