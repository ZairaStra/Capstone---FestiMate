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

//TODO: integrare Lineup

const Backoffice = ({ user }) => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalData, setModalData] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [selectedFestival, setSelectedFestival] = useState(null);
  const [_artists, setArtists] = useState([]);

  const [showCampingMapModal, setShowCampingMapModal] = useState(false);
  const [_campingMapFile, setCampingMapFile] = useState(null);

  const [accommodationPrices, setAccommodationPrices] = useState([]);
  const [showAccommodationModal, setShowAccommodationModal] = useState(false);

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

  const fetchArtists = async () => {
    try {
      const res = await fetch("http://localhost:3002/artists", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setArtists(data.content || data || []);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch items");
    }
  };

  useEffect(() => {
    if (admin?.role === "FESTIVAL_MANAGER") {
      fetchArtists();
    }
  }, [admin?.role]);

  useEffect(() => {
    if (!admin) return;

    const fetchItems = async (page = 0, reset = true) => {
      if (reset) {
        setLoading(true);
        setItems([]);
        setFilteredItems([]);
      }

      try {
        let url = "";
        switch (admin.role) {
          case "SYSTEM_ADMIN":
            url = `http://localhost:3002/admins?page=${page}&size=10`;
            break;
          case "ARTIST_MANAGER":
            url = `http://localhost:3002/artists?page=${page}&size=10`;
            break;
          case "FESTIVAL_MANAGER":
            url = `http://localhost:3002/festivals?page=${page}&size=10`;
            break;
          case "RESERVATION_MANAGER":
            url = `http://localhost:3002/reservations?page=${page}&size=10`;
            break;
          case "USER_MANAGER":
            url = `http://localhost:3002/public-users?page=${page}&size=10`;
            break;
          default:
            url = "";
        }
        if (!url) return;

        const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) throw new Error("Failed to fetch items");
        const data = await res.json();
        const itemsArray = data.content || data.admins || data.artists || data.festivals || data.publicUsers || data || [];

        if (reset) {
          setItems(itemsArray);
          setFilteredItems(itemsArray);
          setCurrentPage(0);
        } else {
          setItems((prev) => [...prev, ...itemsArray]);
          setFilteredItems((prev) => [...prev, ...itemsArray]);
          setCurrentPage(page);
        }

        setHasMore(page < (data.totalPages ? data.totalPages - 1 : 0));
      } catch (err) {
        setError(err.message || "Failed to fetch items");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [admin, token]);

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    const fetchItems = async () => {
      setLoading(true);

      try {
        let url = "";
        switch (admin.role) {
          case "SYSTEM_ADMIN":
            url = `http://localhost:3002/admins?page=${nextPage}&size=10`;
            break;
          case "ARTIST_MANAGER":
            url = `http://localhost:3002/artists?page=${nextPage}&size=10`;
            break;
          case "FESTIVAL_MANAGER":
            url = `http://localhost:3002/festivals?page=${nextPage}&size=10`;
            break;
          case "RESERVATION_MANAGER":
            url = `http://localhost:3002/reservations?page=${nextPage}&size=10`;
            break;
          case "USER_MANAGER":
            url = `http://localhost:3002/public-users?page=${nextPage}&size=10`;
            break;
          default:
            return;
        }

        const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) throw new Error("Failed to fetch more items");
        const data = await res.json();
        const newItems = data.content || data.admins || data.artists || data.festivals || data.publicUsers || data || [];

        setItems((prev) => [...prev, ...newItems]);
        setFilteredItems((prev) => [...prev, ...newItems]);
        setCurrentPage(nextPage);
        setHasMore(nextPage < (data.totalPages ? data.totalPages - 1 : 0));
      } catch (err) {
        setError(err.message || "Failed to load more items");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  };

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
      const res = await fetch(url, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to delete item (${res.status}): ${errorText}`);
      }

      setItems((prev) => prev.filter((i) => i.id !== item.id));
      setFilteredItems((prev) => prev.filter((i) => i.id !== item.id));
    } catch (err) {
      setError(err.message || "Failed to delete item");
    }
  };

  const handleOpenAccommodationModal = (festival) => {
    setSelectedFestival(festival);
    setAccommodationPrices(festival.pricesByUnitType || {});
    setShowAccommodationModal(true);
    setError("");
    setSuccess("");
  };

  const handleUpdateAccommodationPrices = async () => {
    if (!selectedFestival) return;

    setModalLoading(true);
    try {
      const res = await fetch(`http://localhost:3002/festivals/${selectedFestival.id}/accomodation-prices`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(accommodationPrices),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to update accommodation prices: ${errorText}`);
      }

      const updatedFestival = { ...selectedFestival, pricesByUnitType: accommodationPrices };
      setItems((prev) => prev.map((item) => (item.id === selectedFestival.id ? updatedFestival : item)));
      setFilteredItems((prev) => prev.map((item) => (item.id === selectedFestival.id ? updatedFestival : item)));

      setSuccess("Accommodation prices updated successfully");
      setShowAccommodationModal(false);
    } catch (err) {
      setError(err.message || "Failed to update accommodation prices");
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
            fd.append(key, formData[key]);
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

      const res = await fetch(url, options);

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Request failed (${res.status}): ${errorText}`);
      }

      let savedItem;
      try {
        savedItem = await res.json();
      } catch (err) {
        setError(err?.message || "Submit failed, please try again");
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
            type: "customComponent",
            customComponent: <FestiMateDropdown label="Genre" value={data.genre || "POP"} onChange={(val) => setModalData({ ...data, genre: val })} />,
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
          ...(data?.id
            ? [
                {
                  id: "department",
                  label: "Department",
                  value: data.department || "N/A",
                  disabled: true,
                },
                {
                  id: "hiringDate",
                  label: "Hiring Date",
                  value: data.hiringDate || "N/A",
                  disabled: true,
                },
              ]
            : []),
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

  const renderItemLabel = (item) => {
    const entityType = getEntityTypeByRole(admin.role);

    return (
      <Row className="align-items-center gy-2">
        <Col xs={12} sm={9} md={10}>
          {entityType === "reservation" ? (
            <>
              <div>
                <strong>ID:</strong> {item.id}
              </div>
              <div>
                <strong>Festival ID:</strong> {item.festivalId}
              </div>
              <div>
                <strong>User ID:</strong> {item.userId}
              </div>
              <div>
                <strong>Start Date:</strong> {item.startDate}
              </div>
              <div>
                <strong>End Date:</strong> {item.endDate}
              </div>
              <div>
                <strong>Number of Tickets:</strong> {item.numTickets}
              </div>
              <div>
                <strong>Total Price:</strong> {item.totalPrice}
              </div>
              <div>
                <strong>Created:</strong> {item.createdAt}
              </div>
            </>
          ) : (
            <>
              <div>
                <strong>ID:</strong> {item.id}
              </div>
              {item.name && (
                <div>
                  <strong>Name:</strong> {item.name}
                </div>
              )}
              {item.username && (
                <div>
                  <strong>Username:</strong> {item.username}
                </div>
              )}
              {item.surname && (
                <div>
                  <strong>Surname:</strong> {item.surname}
                </div>
              )}
              {item.email && (
                <div>
                  <strong>Email:</strong> {item.email}
                </div>
              )}
              {item.phoneNumber && (
                <div>
                  <strong>Phone:</strong> {item.phoneNumber}
                </div>
              )}
              {item.role && (
                <div>
                  <strong>Role:</strong> {item.role}
                </div>
              )}
              {item.department && (
                <div>
                  <strong>Department:</strong> {item.department}
                </div>
              )}
              {item.hiringDate && (
                <div>
                  <strong>Hiring Date:</strong> {item.hiringDate}
                </div>
              )}
              {item.genre && (
                <div>
                  <strong>Genre:</strong> {item.genre}
                </div>
              )}
              {item.link && (
                <div>
                  <strong>Link:</strong>{" "}
                  <span className="text-break" style={{ wordBreak: "break-all" }}>
                    {item.link}
                  </span>
                </div>
              )}
              {item.coverImg && (
                <div>
                  <strong>Cover Image:</strong>{" "}
                  <span className="text-break" style={{ wordBreak: "break-all" }}>
                    {item.coverImg}
                  </span>
                </div>
              )}
              {item.city && (
                <div>
                  <strong>City:</strong> {item.city}
                </div>
              )}
              {item.country && (
                <div>
                  <strong>Country:</strong> {item.country}
                </div>
              )}
              {item.startDate && (
                <div>
                  <strong>Start Date:</strong> {item.startDate}
                </div>
              )}
              {item.endDate && (
                <div>
                  <strong>End Date:</strong> {item.endDate}
                </div>
              )}
              {item.dailyPrice && (
                <div>
                  <strong>Daily Price:</strong> €{item.dailyPrice}
                </div>
              )}
              {(item.campingMap || admin.role === "FESTIVAL_MANAGER") && (
                <div className="d-flex align-items-center">
                  <span className="me-2">
                    <strong>Camping Map:</strong>{" "}
                    <span className="text-break" style={{ wordBreak: "break-all" }}>
                      {item.campingMap || "Not available"}
                    </span>
                  </span>
                  {admin.role === "FESTIVAL_MANAGER" && (
                    <FestiMatePatchField
                      label=""
                      type="file"
                      value={item.campingMapFile}
                      onPatch={async (file) => {
                        const formData = new FormData();
                        formData.append("campingMap", file);

                        try {
                          const res = await fetch(`http://localhost:3002/festivals/${item.id}/camping-map`, {
                            method: "PATCH",
                            headers: { Authorization: `Bearer ${token}` },
                            body: formData,
                          });

                          if (res.ok) {
                            const updatedItems = items.map((i) => (i.id === item.id ? { ...i, campingMap: "Updated" } : i));
                            setItems(updatedItems);
                            setFilteredItems(updatedItems);
                          } else {
                            throw new Error("Failed to update camping map");
                          }
                        } catch (err) {
                          setError(err?.message || "Failed to update camping map");
                        }
                      }}
                    />
                  )}
                </div>
              )}
            </>
          )}
        </Col>
        <Col xs={12} sm={2}>
          <Row className="gy-3 text-end">
            {canEdit(admin.role) && (
              <Col>
                <FestiMateButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(item);
                  }}
                >
                  Edit
                </FestiMateButton>
              </Col>
            )}
            <Col>
              <FestiMateButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(item);
                }}
              >
                Delete
              </FestiMateButton>
            </Col>
            {admin.role === "FESTIVAL_MANAGER" && entityType === "festival" && (
              <>
                <Col>
                  <FestiMateButton
                    disabled
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    Lineups
                  </FestiMateButton>
                </Col>
                <Col>
                  <FestiMateButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenAccommodationModal(item);
                    }}
                  >
                    Prices
                  </FestiMateButton>
                </Col>
              </>
            )}
          </Row>
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

      {loading && <FestiMateSpinner />}
      {!loading && filteredItems.length === 0 && <Alert variant="warning">No items found</Alert>}

      {!loading && filteredItems.length > 0 && (
        <>
          <FestiMateListgroup
            items={filteredItems.map((item) => ({
              id: item.id,
              label: renderItemLabel(item),
            }))}
          />
          {hasMore && !loading && (
            <div className="text-center my-4">
              <FestiMateButton onClick={handleLoadMore}>Load More</FestiMateButton>
            </div>
          )}
        </>
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
            <Form.Control type="file" accept="image/*" onChange={(e) => setCampingMapFile(e.target.files[0])} required />
          </Form.Group>

          <div className="d-flex justify-content-end mt-3">
            <FestiMateButton className="me-2" onClick={() => setShowCampingMapModal(false)}>
              Close
            </FestiMateButton>
          </div>
        </Form>
      </FestiMateModal>

      <FestiMateModal show={showAccommodationModal} onClose={() => setShowAccommodationModal(false)} title="Update Accommodation Prices">
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
                value={accommodationPrices[unitType.value] || ""}
                onChange={(e) =>
                  setAccommodationPrices({
                    ...accommodationPrices,
                    [unitType.value]: e.target.value ? parseFloat(e.target.value) : undefined,
                  })
                }
              />
            </Form.Group>
          ))}

          <div className="d-flex justify-content-end mt-3">
            <FestiMateButton className="me-2" onClick={() => setShowAccommodationModal(false)}>
              Cancel
            </FestiMateButton>
            <FestiMateButton onClick={handleUpdateAccommodationPrices} disabled={modalLoading}>
              Edit
              {modalLoading && <FestiMateSpinner />}
            </FestiMateButton>
          </div>
        </Form>
      </FestiMateModal>
    </Container>
  );
};

export default Backoffice;
