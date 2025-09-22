import { useState, useEffect } from "react";
import { Container, Row, Col, Alert } from "react-bootstrap";
import FestiMatePatchField from "../../components/FestiMatePatchField";
import FestiMateModal from "../../components/FestiMateModal";
import FestiMateForm from "../../components/FestiMateForm";
import FestiMateSpinner from "../../components/FestiMateSpinner";
import FestiMateButton from "../../components/FestiMateButton";

const MyProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [formValues, setFormValues] = useState({
    username: "",
    name: "",
    surname: "",
    email: "",
    city: "",
    country: "",
  });

  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchUserData = async () => {
    setLoading(true);
    try {
      let res = await fetch("http://localhost:3002/public-users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setUserData(data);
        setFormValues({
          username: data.username || "",
          name: data.name || "",
          surname: data.surname || "",
          email: data.email || "",
          city: data.city || "",
          country: data.country || "",
        });
        setLoading(false);
        return;
      }

      res = await fetch("http://localhost:3002/admins/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const adm = await res.json();
        setUserData(adm);
        setLoading(false);
        return;
      }

      throw new Error(`Failed to fetch profile: ${res.status}`);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchUserData();
    else setLoading(false);
  }, [token]);

  const handlePatch = async (field, value) => {
    try {
      let res;
      if (field === "profileImg") {
        const formData = new FormData();
        formData.append("image", value);
        res = await fetch("http://localhost:3002/users/me/profileImg", {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `Image update failed: ${res.status}`);
        }

        const data = await res.json();
        setUserData((prev) => ({ ...prev, profileImg: data.profileImg || prev.profileImg }));
        return;
      }

      if (field === "password") {
        res = await fetch("http://localhost:3002/users/me/password", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(value),
        });

        if (!res.ok) {
          const text = await res.text();
          try {
            const json = JSON.parse(text);
            const msg = json?.message || json?.errors || JSON.stringify(json) || text;
            throw new Error(msg);
          } catch {
            throw new Error(text || `Password update failed: ${res.status}`);
          }
        }
        return;
      }
      throw new Error("Unsupported patch field");
    } catch (err) {
      console.error("Error updating profile:", err);
      throw err;
    }
  };

  const handlePublicUserUpdate = async () => {
    setSuccess("");
    setError("");
    setFormLoading(true);

    try {
      let res;
      const payload = { ...formValues };
      if (!(formValues.profileImg instanceof File)) delete payload.profileImg;

      if (formValues.profileImg instanceof File) {
        const formData = new FormData();
        formData.append("profileImg", formValues.profileImg);
        ["username", "name", "surname", "email", "city", "country"].forEach((key) => formData.append(key, formValues[key] || ""));
        res = await fetch("http://localhost:3002/public-users/me", {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
      } else {
        res = await fetch("http://localhost:3002/public-users/me", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Update failed: ${res.status}`);
      }

      const updated = await res.json();
      setUserData(updated);
      setFormValues((prev) => ({ ...prev, profileImg: updated.profileImg || prev.profileImg }));
      setSuccess("Profile updated successfully");
    } catch (err) {
      console.error(err);
      setError(err?.message || "Profile update failed");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("http://localhost:3002/public-users/me", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Delete failed: ${res.status}`);
      }

      localStorage.removeItem("token");
      window.location.href = "/";
    } catch (err) {
      console.error("Delete error:", err);
      setError(err?.message || "Failed to delete account");
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  };

  const isPublicUser = !userData?.role;

  const handleChange = (id, val) => {
    setFormValues((prev) => ({ ...prev, [id]: val }));
  };

  const fields = [
    { id: "username", label: "Username", type: "text", value: formValues.username, onChange: (e) => handleChange("username", e.target.value) },
    { id: "name", label: "Name", type: "text", value: formValues.name, onChange: (e) => handleChange("name", e.target.value) },
    { id: "surname", label: "Surname", type: "text", value: formValues.surname, onChange: (e) => handleChange("surname", e.target.value) },
    { id: "email", label: "Email", type: "email", value: formValues.email, onChange: (e) => handleChange("email", e.target.value) },
    { id: "city", label: "City", type: "text", value: formValues.city, onChange: (e) => handleChange("city", e.target.value) },
    { id: "country", label: "Country", type: "text", value: formValues.country, onChange: (e) => handleChange("country", e.target.value) },
  ];

  return (
    <Container className="mb-5" style={{ minHeight: "80vh" }}>
      {loading ? (
        <FestiMateSpinner />
      ) : !userData ? (
        <Alert variant="warning">Profile not found</Alert>
      ) : (
        <Row className="justify-content-center g-2">
          <Col xs={12} md={8}>
            <h2 className="display-3 mt-5">My Profile</h2>

            <Row className="g-4 justify-content-center">
              <Col xs={12} md={8}>
                <Row className="justify-content-between align-items-end">
                  <Col xs={12} sm={6}>
                    <FestiMatePatchField label="Password" type="password" value="" onPatch={(pw) => handlePatch("password", pw)} />
                  </Col>
                  <Col xs={12} sm={6}>
                    <FestiMatePatchField label="" type="file" value={userData.profileImg} onPatch={(file) => handlePatch("profileImg", file)} />
                  </Col>
                </Row>
              </Col>

              {fields.map((field) => (
                <Col xs={12} md={8} key={field.id}>
                  <p className="p-form p-2 text-center">
                    <strong className="me-2">{field.label}:</strong> {field.value}
                  </p>
                </Col>
              ))}
            </Row>

            {isPublicUser && (
              <>
                <Row className="mt-4 gy-4 justify-content-evenly">
                  <Col xs={12} sm={6} className="text-center">
                    <FestiMateButton onClick={() => setShowDeleteModal(true)}>Delete Account</FestiMateButton>
                  </Col>
                  <Col xs={12} sm={6} className="text-center">
                    <FestiMateButton
                      onClick={() => {
                        setSuccess("");
                        setError("");
                        setShowUpdateModal(true);
                      }}
                    >
                      Update Profile
                    </FestiMateButton>
                  </Col>
                </Row>

                <FestiMateModal show={showUpdateModal} title="Update Profile" onClose={() => setShowUpdateModal(false)}>
                  {success && <Alert variant="success">{success}</Alert>}
                  {error && <Alert variant="danger">{error}</Alert>}

                  <FestiMateForm fields={fields} onSubmit={handlePublicUserUpdate} submitLabel="Update Profile" loading={formLoading} />
                </FestiMateModal>

                <FestiMateModal show={showDeleteModal} title="Confirm Delete" onClose={() => setShowDeleteModal(false)}>
                  {error && <Alert variant="danger">{error}</Alert>}

                  <p className="text-center">
                    Are you sure you want to <strong>permanently</strong> delete your account? This action cannot be undone.
                  </p>
                  <div className="d-flex justify-content-end gap-2 mt-3">
                    <FestiMateButton variant="secondary" onClick={() => setShowDeleteModal(false)}>
                      Cancel
                    </FestiMateButton>
                    <FestiMateButton variant="danger" onClick={handleDeleteAccount} disabled={deleteLoading}>
                      {deleteLoading ? "Deleting..." : "Delete"}
                    </FestiMateButton>
                  </div>
                </FestiMateModal>
              </>
            )}
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default MyProfile;
