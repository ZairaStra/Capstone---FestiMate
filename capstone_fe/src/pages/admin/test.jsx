import { useState, useEffect } from "react";
import { Container, Row, Col, Alert, Form } from "react-bootstrap";
import FestiMateSearchbar from "../../components/FestiMateSearchbar";
import FestiMateListgroup from "../../components/FestiMateListgroup";
import FestiMateButton from "../../components/FestiMateButton";
import FestiMateModal from "../../components/FestiMateModal";
import FestiMateForm from "../../components/FestiMateForm";
import FestiMateSpinner from "../../components/FestiMateSpinner";
import FestiMateDropdown from "../../components/FestiMateDropdown";
import FestiMatePatchField from "../../components/FestiMatePatchField";

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

  const [showLineupModal, setShowLineupModal] = useState(false);
  const [lineups, setLineups] = useState([]);
  const [lineupLoading, setLineupLoading] = useState(false);
  const [selectedFestival, setSelectedFestival] = useState(null);
  const [showLineupForm, setShowLineupForm] = useState(false);
  const [editingLineup, setEditingLineup] = useState(null);

  const [showCampingMapModal, setShowCampingMapModal] = useState(false);
  const [showAccomodationModal, setShowAccomodationModal] = useState(false);
  const [campingMapData, setCampingMapData] = useState({ campingMap: null, pricesByUnitType: {} });
  const [accomodationPrices, setAccomodationPrices] = useState({});

  const admin = user;
  const token = localStorage.getItem("token");

  const UNIT_TYPES = [
    { value: "TENT1", label: "Single-person Tent" },
    { value: "TENT2", label: "Two-person tent" },
    { value: "TENT4", label: "Four-person tent" },
    { value: "TENT6", label: "Six-person tent" },
    { value: "BUNGALOW4", label: "Bungalow" },
    { value: "BUBBLE2", label: "Bubble" },
  ];

  const getEntityTypeByRole = (role) => {
    switch (role) {
      case "SYSTEM_ADMIN":
        return "admin";
      case "FESTIVAL_MANAGER":
        return "festival";
      case "ARTIST_MANAGER":
        return "artist";
      case "USER_MANAGER":
        return "user";
      case "RESERVATION_MANAGER":
        return "reservation";
      default:
        return null;
    }
  };

  const canCreate = (role) => {
    return ["SYSTEM_ADMIN", "FESTIVAL_MANAGER", "ARTIST_MANAGER"].includes(role);
  };

  const canEdit = (role) => {
    return role !== "RESERVATION_MANAGER";
  };

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
        const itemsArray = data.content || data.admins || data.artists || data.festivals || data.publicUsers || data || [];
        setItems(itemsArray);
        setFilteredItems(itemsArray);
      } catch (err) {
        console.error("Fetch error:", err);
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

  const handleAddNew = () => {
    const type = getEntityTypeByRole(admin.role);
    if (!type || !canCreate(admin.role)) return;

    setModalType(type);
    let initialData = {};

    if (type === "admin") {
      initialData = { role: "SYSTEM_ADMIN" };
    } else if (type === "artist") {
      initialData = { genre: "POP" };
    } else if (type === "festival") {
      initialData = { eventPlanner: admin.id };
    }

    setModalData(initialData);
    setSuccess("");
    setError("");
    setShowModal(true);
  };

  const handleEdit = (item) => {
    if (!canEdit(admin.role)) return;

    const type = getEntityTypeByRole(admin.role);
    if (!type) return;

    setModalType(type);
    setModalData({ ...item });
    setSuccess("");
    setError("");
    setShowModal(true);
  };

  const handleDelete = async (item) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    const entityType = getEntityTypeByRole(admin.role);
    if (!entityType) return;

    try {
      let url = "";
      switch (entityType) {
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
        case "reservation":
          url = `http://localhost:3002/reservations/${item.id}`;
          break;
        default:
          throw new Error("Unknown entity type");
      }

      console.log("DELETE request to:", url);
      const res = await fetch(url, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("DELETE failed:", res.status, errorText);
        throw new Error(`Failed to delete item (${res.status}): ${errorText}`);
      }

      setItems((prev) => prev.filter((i) => i.id !== item.id));
      setFilteredItems((prev) => prev.filter((i) => i.id !== item.id));
      setSuccess("Item deleted successfully");
    } catch (err) {
      console.error("Delete error:", err);
      setError(err.message || "Failed to delete item");
    }
  };

  const handleOpenCampingMapModal = (festival) => {
    setSelectedFestival(festival);
    setCampingMapData({
      campingMap: null,
    });
    setShowCampingMapModal(true);
    setError("");
    setSuccess("");
  };

  const handleUpdateCampingMap = async () => {
    if (!selectedFestival || !campingMapData.campingMap) {
      setError("Please select a camping map file");
      return;
    }

    setModalLoading(true);
    try {
      const formData = new FormData();
      formData.append("campingMap", campingMapData.campingMap);

      if (Object.keys(campingMapData.pricesByUnitType).length > 0) {
        formData.append("pricesByUnitType", JSON.stringify(campingMapData.pricesByUnitType));
      }

      const res = await fetch(`http://localhost:3002/festivals/${selectedFestival.id}/camping-map`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to update camping map: ${errorText}`);
      }

      setSuccess("Camping map updated successfully");
      setShowCampingMapModal(false);
    } catch (err) {
      console.error("Camping map update error:", err);
      setError(err.message || "Failed to update camping map");
    } finally {
      setModalLoading(false);
    }
  };

  const handleOpenAccomodationModal = (festival) => {
    setSelectedFestival(festival);
    setAccomodationPrices(festival.pricesByUnitType || {});
    setShowAccomodationModal(true);
    setError("");
    setSuccess("");
  };

  const handleUpdateAccomodationPrices = async () => {
    if (!selectedFestival) return;

    setModalLoading(true);
    try {
      const res = await fetch(`http://localhost:3002/festivals/${selectedFestival.id}/accomodation-prices`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(accomodationPrices),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to update accomodation prices: ${errorText}`);
      }

      setSuccess("Accomodation prices updated successfully");
      setShowAccomodationModal(false);
    } catch (err) {
      console.error("Accomodation prices update error:", err);
      setError(err.message || "Failed to update accomodation prices");
    } finally {
      setModalLoading(false);
    }
  };

  const handleOpenLineupsModal = async (festival) => {
    setSelectedFestival(festival);
    setShowLineupModal(true);
    setLineupLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`http://localhost:3002/lineups/festivals/${festival.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch lineups");
      const data = await res.json();
      setLineups(data.content || data || []);
    } catch (err) {
      console.error("Lineups fetch error:", err);
      setError("Failed to fetch lineups");
    } finally {
      setLineupLoading(false);
    }
  };

  const handleCreateLineup = () => {
    setEditingLineup(null);
    setShowLineupForm(true);
  };

  const handleEditLineup = (lineup) => {
    setEditingLineup(lineup);
    setShowLineupForm(true);
  };

  const handleDeleteLineup = async (lineup) => {
    if (!window.confirm("Are you sure you want to delete this lineup?")) return;

    try {
      const res = await fetch(`http://localhost:3002/lineups/${lineup.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete lineup");

      setLineups((prev) => prev.filter((l) => l.id !== lineup.id));
      setSuccess("Lineup deleted successfully");
    } catch (err) {
      console.error("Lineup delete error:", err);
      setError("Failed to delete lineup");
    }
  };

  const handleLineupSubmit = async (formData) => {
    setModalLoading(true);
    try {
      const url = editingLineup ? `http://localhost:3002/lineups/${editingLineup.id}` : "http://localhost:3002/lineups/register";

      const method = editingLineup ? "PUT" : "POST";

      const payload = {
        ...formData,
        festivalId: selectedFestival.id,
      };

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Failed to ${editingLineup ? "update" : "create"} lineup`);

      const savedLineup = editingLineup ? await res.json() : { ...payload, id: Date.now() };

      if (editingLineup) {
        setLineups((prev) => prev.map((l) => (l.id === editingLineup.id ? savedLineup : l)));
        setSuccess("Lineup updated successfully");
      } else {
        setLineups((prev) => [savedLineup, ...prev]);
        setSuccess("Lineup created successfully");
      }

      setShowLineupForm(false);
      setEditingLineup(null);
    } catch (err) {
      console.error("Lineup submit error:", err);
      setError(`Failed to ${editingLineup ? "update" : "create"} lineup`);
    } finally {
      setModalLoading(false);
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
            throw new Error("Cannot create new public users from admin panel");
          }
          url = `http://localhost:3002/public-users/${modalData.id}`;
          break;
        case "admin":
          url = modalData?.id ? `http://localhost:3002/admins/${modalData.id}` : "http://localhost:3002/admins/register";
          break;
        default:
          throw new Error("Unknown modal type");
      }

      let options = {
        method,
        headers: { Authorization: `Bearer ${token}` },
      };

      if (modalType === "festival" || modalType === "artist") {
        const fd = new FormData();
        Object.keys(formData).forEach((key) => {
          if (formData[key] != null && formData[key] !== "") {
            if ((key === "coverImg" || key === "campingMap") && formData[key] instanceof File) {
              fd.append(key, formData[key]);
            } else if (key !== "coverImg" && key !== "campingMap") {
              fd.append(key, formData[key]);
            }
          }
        });

        if (modalData.coverImg instanceof File) {
          fd.append("coverImg", modalData.coverImg);
        }
        if (modalData.campingMap instanceof File) {
          fd.append("campingMap", modalData.campingMap);
        }

        if (modalType === "festival" && !formData.eventPlanner && admin.id) {
          fd.append("eventPlanner", admin.id);
        }
        options.body = fd;
      } else {
        options.headers["Content-Type"] = "application/json";

        let payload = { ...formData };

        if (modalType === "admin" && modalData?.id) {
          delete payload.password;
        }

        options.body = JSON.stringify(payload);
      }

      console.log("Request:", method, url);
      console.log("Body:", modalType === "festival" || modalType === "artist" ? "FormData" : JSON.parse(options.body));

      const res = await fetch(url, options);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Request failed:", res.status, errorText);
        throw new Error(`Request failed (${res.status}): ${errorText}`);
      }

      let savedItem;
      try {
        savedItem = await res.json();
      } catch (err) {
        savedItem = modalData;
      }

      if (modalData?.id) {
        setItems((prev) => prev.map((i) => (i.id === modalData.id ? { ...i, ...savedItem } : i)));
        setFilteredItems((prev) => prev.map((i) => (i.id === modalData.id ? { ...i, ...savedItem } : i)));
        setSuccess("Item updated successfully");
      } else {
        const newItem = savedItem.id ? savedItem : { ...formData, id: savedItem.id || Date.now() };
        setItems((prev) => [newItem, ...prev]);
        setFilteredItems((prev) => [newItem, ...prev]);
        setSuccess("Item created successfully");
      }

      setModalData(savedItem);
    } catch (err) {
      console.error("Submit error:", err);
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
          {
            id: "name",
            label: "Festival Name",
            value: data.name || "",
            onChange: (e) => setModalData({ ...data, name: e.target.value }),
            required: true,
          },
          {
            id: "city",
            label: "City",
            value: data.city || "",
            onChange: (e) => setModalData({ ...data, city: e.target.value }),
            required: true,
          },
          {
            id: "country",
            label: "Country",
            value: data.country || "",
            onChange: (e) => setModalData({ ...data, country: e.target.value }),
            required: true,
          },
          {
            id: "startDate",
            label: "Start Date",
            type: "date",
            value: data.startDate || "",
            onChange: (e) => setModalData({ ...data, startDate: e.target.value }),
            required: true,
          },
          {
            id: "endDate",
            label: "End Date",
            type: "date",
            value: data.endDate || "",
            onChange: (e) => setModalData({ ...data, endDate: e.target.value }),
            required: true,
          },
          {
            id: "maxNumbPartecipants",
            label: "Max Participants",
            type: "number",
            value: data.maxNumbPartecipants || "",
            onChange: (e) => setModalData({ ...data, maxNumbPartecipants: parseInt(e.target.value) }),
            required: true,
          },
          {
            id: "dailyPrice",
            label: "Daily Price",
            type: "number",
            step: "0.01",
            value: data.dailyPrice || "",
            onChange: (e) => setModalData({ ...data, dailyPrice: parseFloat(e.target.value) }),
            required: true,
          },
          {
            id: "coverImg",
            label: "Cover Image",
            type: "file",
            accept: "image/*",
            onChange: (e) => setModalData({ ...data, coverImg: e.target.files[0] }),
          },
          {
            id: "campingMap",
            label: "Camping Map",
            type: "file",
            accept: "image/*",
            onChange: (e) => setModalData({ ...data, campingMap: e.target.files[0] }),
          },
        ];

      case "artist":
        return [
          {
            id: "name",
            label: "Artist Name",
            value: data.name || "",
            onChange: (e) => setModalData({ ...data, name: e.target.value }),
            required: true,
          },
          {
            id: "genre",
            label: "Genre",
            type: "custom",
            component: <FestiMateDropdown value={data.genre || "POP"} onChange={(genre) => setModalData({ ...data, genre })} />,
            required: true,
          },
          {
            id: "link",
            label: "Link",
            value: data.link || "",
            onChange: (e) => setModalData({ ...data, link: e.target.value }),
          },
          {
            id: "coverImg",
            label: "Cover Image",
            type: "file",
            accept: "image/*",
            onChange: (e) => setModalData({ ...data, coverImg: e.target.files[0] }),
          },
        ];

      case "user":
        return [
          {
            id: "username",
            label: "Username",
            value: data.username || "",
            onChange: (e) => setModalData({ ...data, username: e.target.value }),
            required: true,
          },
          {
            id: "name",
            label: "Name",
            value: data.name || "",
            onChange: (e) => setModalData({ ...data, name: e.target.value }),
            required: true,
          },
          {
            id: "surname",
            label: "Surname",
            value: data.surname || "",
            onChange: (e) => setModalData({ ...data, surname: e.target.value }),
            required: true,
          },
          {
            id: "email",
            label: "Email",
            type: "email",
            value: data.email || "",
            onChange: (e) => setModalData({ ...data, email: e.target.value }),
            required: true,
          },
          {
            id: "city",
            label: "City",
            value: data.city || "",
            onChange: (e) => setModalData({ ...data, city: e.target.value }),
            required: true,
          },
          {
            id: "country",
            label: "Country",
            value: data.country || "",
            onChange: (e) => setModalData({ ...data, country: e.target.value }),
            required: true,
          },
        ];

      case "admin":
        return [
          {
            id: "username",
            label: "Username",
            value: data.username || "",
            onChange: (e) => setModalData({ ...data, username: e.target.value }),
            required: true,
          },
          {
            id: "name",
            label: "Name",
            value: data.name || "",
            onChange: (e) => setModalData({ ...data, name: e.target.value }),
            required: true,
          },
          {
            id: "surname",
            label: "Surname",
            value: data.surname || "",
            onChange: (e) => setModalData({ ...data, surname: e.target.value }),
            required: true,
          },
          {
            id: "email",
            label: "Email",
            type: "email",
            value: data.email || "",
            onChange: (e) => setModalData({ ...data, email: e.target.value }),
            required: true,
          },
          ...(!data?.id
            ? [
                {
                  id: "password",
                  label: "Password",
                  type: "password",
                  value: data.password || "",
                  onChange: (e) => setModalData({ ...data, password: e.target.value }),
                  required: true,
                },
              ]
            : []),
          {
            id: "phoneNumber",
            label: "Phone Number",
            value: data.phoneNumber || "",
            onChange: (e) => setModalData({ ...data, phoneNumber: e.target.value }),
            required: true,
          },
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
            value: data.role || "SYSTEM_ADMIN",
            onChange: (e) => setModalData({ ...data, role: e.target.value }),
            required: true,
          },
        ];

      default:
        return [];
    }
  };

  const getLineupFields = () => {
    const data = editingLineup || {};

    return [
      {
        id: "date",
        label: "Date",
        type: "date",
        value: data.date || "",
        required: true,
      },
      {
        id: "startTime",
        label: "Start Time",
        type: "time",
        value: data.startTime || "",
        required: true,
      },
      {
        id: "endTime",
        label: "End Time",
        type: "time",
        value: data.endTime || "",
        required: true,
      },
      {
        id: "artistId",
        label: "Artist ID",
        type: "number",
        value: data.artistId || "",
        required: true,
      },
    ];
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSuccess("");
    setError("");
    setModalData(null);
    setModalType("");
  };

  const handlePatchField = async (item, fieldType, data) => {
    try {
      const entityType = getEntityTypeByRole(admin.role);
      let url = "";
      let options = {
        headers: { Authorization: `Bearer ${token}` },
      };

      switch (fieldType) {
        case "campingMap":
          url = `http://localhost:3002/festivals/${item.id}/camping-map`;
          const formData = new FormData();
          formData.append("campingMap", data);
          options.method = "PATCH";
          options.body = formData;
          break;

        case "coverImg":
          if (entityType === "festival") {
            url = `http://localhost:3002/festivals/${item.id}`;
            const fd = new FormData();
            fd.append("coverImg", data);
            options.method = "PUT";
            options.body = fd;
          } else if (entityType === "artist") {
            url = `http://localhost:3002/artists/${item.id}`;
            const fd = new FormData();
            fd.append("coverImg", data);
            options.method = "PUT";
            options.body = fd;
          }
          break;

        case "dailyPrice":
          url = `http://localhost:3002/festivals/${item.id}`;
          options.method = "PUT";
          options.headers["Content-Type"] = "application/json";
          options.body = JSON.stringify({ ...item, dailyPrice: data.newPrice });
          break;

        default:
          throw new Error("Unknown field type");
      }

      const res = await fetch(url, options);
      if (!res.ok) throw new Error("Failed to update field");

      const updatedItems = items.map((i) => (i.id === item.id ? { ...i, [fieldType]: fieldType === "dailyPrice" ? data.newPrice : data } : i));
      setItems(updatedItems);
      setFilteredItems(updatedItems);
      setSuccess(`${fieldType} updated successfully`);
    } catch (err) {
      console.error("Patch field error:", err);
      setError(`Failed to update ${fieldType}`);
    }
  };

  const renderItemLabel = (item) => {
    const entityType = getEntityTypeByRole(admin.role);

    return (
      <Row className="align-items-center gy-2">
        <Col xs={12} sm={8}>
          {entityType === "reservation" ? (
            <>
              <div className="d-flex align-items-center justify-content-between">
                <span>
                  <strong>ID:</strong> {item.id}
                </span>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <span>
                  <strong>Festival ID:</strong> {item.festivalId}
                </span>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <span>
                  <strong>User ID:</strong> {item.userId}
                </span>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <span>
                  <strong>Start Date:</strong> {item.startDate}
                </span>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <span>
                  <strong>End Date:</strong> {item.endDate}
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="d-flex align-items-center justify-content-between">
                <span>
                  <strong>ID:</strong> {item.id}
                </span>
              </div>
              {item.name && (
                <div className="d-flex align-items-center justify-content-between">
                  <span>
                    <strong>Name:</strong> {item.name}
                  </span>
                </div>
              )}
              {item.username && (
                <div className="d-flex align-items-center justify-content-between">
                  <span>
                    <strong>Username:</strong> {item.username}
                  </span>
                </div>
              )}
              {item.email && (
                <div className="d-flex align-items-center justify-content-between">
                  <span>
                    <strong>Email:</strong> {item.email}
                  </span>
                </div>
              )}
              {item.role && (
                <div className="d-flex align-items-center justify-content-between">
                  <span>
                    <strong>Role:</strong> {item.role}
                  </span>
                </div>
              )}
              {item.genre && (
                <div className="d-flex align-items-center justify-content-between">
                  <span>
                    <strong>Genre:</strong> {item.genre}
                  </span>
                </div>
              )}
              {item.city && (
                <div className="d-flex align-items-center justify-content-between">
                  <span>
                    <strong>City:</strong> {item.city}
                  </span>
                </div>
              )}
              {item.startDate && (
                <div className="d-flex align-items-center justify-content-between">
                  <span>
                    <strong>Start Date:</strong> {item.startDate}
                  </span>
                </div>
              )}
              {admin.role === "FESTIVAL_MANAGER" && entityType === "festival" && (
                <>
                  {item.dailyPrice && (
                    <div className="d-flex align-items-center justify-content-between">
                      <span>
                        <strong>Daily Price:</strong> €{item.dailyPrice}
                      </span>
                      <FestiMatePatchField label="" value={item.dailyPrice} type="price" onPatch={(data) => handlePatchField(item, "dailyPrice", data)} />
                    </div>
                  )}
                  <div className="d-flex align-items-center justify-content-between">
                    <span>
                      <strong>Cover Image:</strong>
                    </span>
                    <FestiMatePatchField label="" value={item.coverImg} type="file" onPatch={(file) => handlePatchField(item, "coverImg", file)} />
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <span>
                      <strong>Camping Map:</strong>
                    </span>
                    <FestiMatePatchField label="" value={item.campingMap} type="file" onPatch={(file) => handlePatchField(item, "campingMap", file)} />
                  </div>
                </>
              )}

              {admin.role === "ARTIST_MANAGER" && entityType === "artist" && (
                <div className="d-flex align-items-center justify-content-between">
                  <span>
                    <strong>Cover Image:</strong>
                  </span>
                  <FestiMatePatchField label="" value={item.coverImg} type="file" onPatch={(file) => handlePatchField(item, "coverImg", file)} />
                </div>
              )}
            </>
          )}
        </Col>
        <Col xs={12} sm={4}>
          <div className="d-flex flex-wrap gap-2 mb-2">
            {canEdit(admin.role) && (
              <FestiMateButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(item);
                }}
              >
                Edit
              </FestiMateButton>
            )}
            <FestiMateButton
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(item);
              }}
            >
              Delete
            </FestiMateButton>
            {admin.role === "FESTIVAL_MANAGER" && entityType === "festival" && (
              <FestiMateButton
                variant="success"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenLineupsModal(item);
                }}
              >
                Lineups
              </FestiMateButton>
            )}
          </div>
          {admin.role === "FESTIVAL_MANAGER" && entityType === "festival" && (
            <div className="d-flex flex-wrap gap-2">
              <FestiMateButton
                variant="info"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenAccomodationModal(item);
                }}
              >
                Accomodation Prices
              </FestiMateButton>
            </div>
          )}
        </Col>
      </Row>
    );
  };

  return (
    <Container className="mb-5" style={{ minHeight: "80vh" }}>
      <Row className="align-items-center mb-3">
        <Col xs={12} md={8}>
          <FestiMateSearchbar value={search} onChange={handleSearch} onSearch={handleSearch} />
        </Col>
        <Col xs={12} md={4} className="text-end">
          {canCreate(admin.role) && <FestiMateButton onClick={handleAddNew}>Add New</FestiMateButton>}
        </Col>
      </Row>

      {success && (
        <Alert variant="success" className="mb-3">
          {success}
        </Alert>
      )}

      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}

      {loading && <FestiMateSpinner />}
      {!loading && filteredItems.length === 0 && <Alert variant="warning">No items found</Alert>}

      {!loading && filteredItems.length > 0 && (
        <FestiMateListgroup
          items={filteredItems.map((item) => ({
            id: item.id,
            label: renderItemLabel(item),
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
        <FestiMateForm fields={getModalFields()} onSubmit={handleModalSubmit} loading={modalLoading} submitLabel={modalData?.id ? "Save Changes" : "Create"} />
      </FestiMateModal>

      <FestiMateModal show={showCampingMapModal} onClose={() => setShowCampingMapModal(false)} title="Update Camping Map">
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
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Camping Map</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) =>
                setCampingMapData({
                  ...campingMapData,
                  campingMap: e.target.files[0],
                })
              }
              required
            />
          </Form.Group>

          <h5>Prices by Unit Type (Optional)</h5>
          {UNIT_TYPES.map((unitType) => (
            <Form.Group key={unitType.value} className="mb-2">
              <Form.Label>{unitType.label}</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                placeholder="Enter price"
                value={campingMapData.pricesByUnitType[unitType.value] || ""}
                onChange={(e) =>
                  setCampingMapData({
                    ...campingMapData,
                    pricesByUnitType: {
                      ...campingMapData.pricesByUnitType,
                      [unitType.value]: e.target.value ? parseFloat(e.target.value) : undefined,
                    },
                  })
                }
              />
            </Form.Group>
          ))}

          <div className="d-flex justify-content-end mt-3">
            <FestiMateButton variant="secondary" className="me-2" onClick={() => setShowCampingMapModal(false)}>
              Cancel
            </FestiMateButton>
            <FestiMateButton onClick={handleUpdateCampingMap} disabled={modalLoading}>
              {modalLoading ? "Updating..." : "Update Camping Map"}
            </FestiMateButton>
          </div>
        </Form>
      </FestiMateModal>

      <FestiMateModal show={showAccomodationModal} onClose={() => setShowAccomodationModal(false)} title="Update Accomodation Prices">
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
        <Form>
          {UNIT_TYPES.map((unitType) => (
            <Form.Group key={unitType.value} className="mb-3">
              <Form.Label>{unitType.label}</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                placeholder="Enter price"
                value={accomodationPrices[unitType.value] || ""}
                onChange={(e) =>
                  setAccomodationPrices({
                    ...accomodationPrices,
                    [unitType.value]: e.target.value ? parseFloat(e.target.value) : undefined,
                  })
                }
              />
            </Form.Group>
          ))}

          <div className="d-flex justify-content-end mt-3">
            <FestiMateButton variant="secondary" className="me-2" onClick={() => setShowAccomodationModal(false)}>
              Cancel
            </FestiMateButton>
            <FestiMateButton onClick={handleUpdateAccomodationPrices} disabled={modalLoading}>
              {modalLoading ? "Updating..." : "Update Prices"}
            </FestiMateButton>
          </div>
        </Form>
      </FestiMateModal>

      <FestiMateModal
        show={showLineupModal}
        onClose={() => {
          setShowLineupModal(false);
          setShowLineupForm(false);
          setEditingLineup(null);
        }}
        title={`Manage Lineups - ${selectedFestival?.name}`}
        size="lg"
      >
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

        {!showLineupForm ? (
          <>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5>Lineups</h5>
              <FestiMateButton onClick={handleCreateLineup}>Add New Lineup</FestiMateButton>
            </div>

            {lineupLoading && <FestiMateSpinner />}

            {!lineupLoading && lineups.length === 0 && <Alert variant="info">No lineups found for this festival</Alert>}

            {!lineupLoading && lineups.length > 0 && (
              <FestiMateListgroup
                items={lineups.map((lineup) => ({
                  id: lineup.id,
                  label: (
                    <Row className="align-items-center">
                      <Col xs={12} sm={8}>
                        <div>
                          <strong>Date:</strong> {lineup.date}
                        </div>
                        <div>
                          <strong>Time:</strong> {lineup.startTime} - {lineup.endTime}
                        </div>
                        <div>
                          <strong>Artist ID:</strong> {lineup.artistId}
                        </div>
                      </Col>
                      <Col xs={12} sm={4}>
                        <FestiMateButton
                          size="sm"
                          className="me-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditLineup(lineup);
                          }}
                        >
                          Edit
                        </FestiMateButton>
                        <FestiMateButton
                          variant="danger"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteLineup(lineup);
                          }}
                        >
                          Delete
                        </FestiMateButton>
                      </Col>
                    </Row>
                  ),
                }))}
              />
            )}
          </>
        ) : (
          <>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5>{editingLineup ? "Edit Lineup" : "Add New Lineup"}</h5>
              <FestiMateButton
                variant="secondary"
                onClick={() => {
                  setShowLineupForm(false);
                  setEditingLineup(null);
                }}
              >
                Back to List
              </FestiMateButton>
            </div>

            <FestiMateForm
              fields={getLineupFields()}
              onSubmit={handleLineupSubmit}
              loading={modalLoading}
              submitLabel={editingLineup ? "Update Lineup" : "Create Lineup"}
            />
          </>
        )}
      </FestiMateModal>
    </Container>
  );
};

export default Backoffice;
