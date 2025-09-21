{
  /*import { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import FestiMatePatchField from "../../components/FestiMatePatchField";
import FestiMateModal from "../../components/FestiMateModal";
import FestiMateForm from "../../components/FestiMateForm";

const MyProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [formValues, setFormValues] = useState({
    username: "",
    name: "",
    surname: "",
    email: "",
    city: "",
    country: "",
    profileImg: null,
  });
  const [formLoading, setFormLoading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const checkRes = await fetch("http://localhost:3002/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!checkRes.ok) throw new Error("Authentication failed");
      const basic = await checkRes.json();

      const endpoint = basic.role ? "/admins/me" : "/public-users/me";

      const res = await fetch(`http://localhost:3002${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed profile fetch");
      const data = await res.json();

      setUserData(data);
      setFormValues({
        username: data.username || "",
        name: data.name || "",
        surname: data.surname || "",
        email: data.email || "",
        city: data.city || "",
        country: data.country || "",
        profileImg: null,
      });
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchUserData();
    else setLoading(false);
  }, [token]);

  const handlePatch = async (field, value) => {
    setSuccess("");
    setError("");
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
        if (!res.ok) throw new Error("Profile image update failed");
        const updated = await res.json();
        setUserData((prev) => ({ ...prev, profileImg: updated.profileImg }));
        setSuccess("Profile image has been updated succesfully");
      } else if (field === "password") {
        res = await fetch("http://localhost:3002/users/me/password", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ password: value }),
        });
        if (!res.ok) throw new Error("Password update failed");
        setSuccess("Password has been updated succesfully");
      }
    } catch (err) {
      console.error("Error updating:", err);
      setError("Update failed");
    }
  };

  const handlePublicUserUpdate = async () => {
    setSuccess("");
    setError("");
    setFormLoading(true);

    try {
      let res;
      if (formValues.profileImg instanceof File) {
        const formData = new FormData();
        Object.entries(formValues).forEach(([k, v]) => formData.append(k, v || ""));
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
          body: JSON.stringify(formValues),
        });
      }
      if (!res.ok) throw new Error("Update failed");
      const updated = await res.json();
      setUserData(updated);
      setSuccess("Your profile has been succesfully updated");
      setShowUpdateModal(false);
    } catch (err) {
      console.error(err);
      setError("Profile update failed");
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) return <Spinner animation="grow" className="spinner" />;
  if (!userData) return <p>Profile not found</p>;

  const isPublicUser = !userData.role;

  const fields = [
    {
      id: "username",
      label: "Username",
      type: "text",
      value: formValues.username,
      onChange: (e) => setFormValues({ ...formValues, username: e.target.value }),
    },
    { id: "name", label: "Name", type: "text", value: formValues.name, onChange: (e) => setFormValues({ ...formValues, name: e.target.value }) },
    { id: "surname", label: "Surname", type: "text", value: formValues.surname, onChange: (e) => setFormValues({ ...formValues, surname: e.target.value }) },
    { id: "email", label: "Email", type: "email", value: formValues.email, onChange: (e) => setFormValues({ ...formValues, email: e.target.value }) },
    { id: "city", label: "City", type: "text", value: formValues.city, onChange: (e) => setFormValues({ ...formValues, city: e.target.value }) },
    { id: "country", label: "Country", type: "text", value: formValues.country, onChange: (e) => setFormValues({ ...formValues, country: e.target.value }) },
    { id: "profileImg", label: "Profile Image", type: "file", onChange: (e) => setFormValues({ ...formValues, profileImg: e.target.files[0] }) },
  ];

  return (
    <Container className="my-5 py-5">
      <Row className="justify-content-center g-2">
        <Col xs={12} md={8}>
          <h2 className="display-3 mt-5">My Profile</h2>
          <Row className="g-4 justify-content-center">
            <Col xs={12} md={8}>
              <Row className="align-items-end g3">
                <Col xs={12} sm={6} className="justify-content-between align-items-end">
                  <FestiMatePatchField label="" type="password" onPatch={(pw) => handlePatch("password", pw)} />
                </Col>
                <Col xs={12} sm={6} className="justify-content-between align-items-end">
                  {userData.profileImg && (
                    <img src={userData.profileImg} alt="Profile" className="img-fluid rounded-circle mb-2" style={{ maxWidth: "100px" }} />
                  )}
                  <FestiMatePatchField label="" type="file" onPatch={(file) => handlePatch("profileImg", file)} />
                </Col>
              </Row>
            </Col>

            {["username", "name", "surname", "email", "city", "country"].map(
              (key) =>
                userData[key] && (
                  <Col xs={12} md={8} key={key}>
                    <p className="p-form p-2 text-center">
                      <strong className="me-2">{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {userData[key]}
                    </p>
                  </Col>
                )
            )}
          </Row>

          {isPublicUser && (
            <>
              <div className="mt-4 text-end">
                <Button
                  variant="none"
                  className="btn-festimate"
                  onClick={() => {
                    setSuccess("");
                    setError("");
                    setShowUpdateModal(true);
                  }}
                >
                  Update Profile
                </Button>
              </div>

              <FestiMateModal show={showUpdateModal} onClose={() => setShowUpdateModal(false)} title="Update Profile">
                {success && <Alert variant="success">{success}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}

                <FestiMateForm fields={fields} onSubmit={handlePublicUserUpdate} submitLabel="Update Profile" loading={formLoading} />
              </FestiMateModal>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default MyProfile;
*/
}
{
  /*
import { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import FestiMatePatchField from "../../components/FestiMatePatchField";
import FestiMateModal from "../../components/FestiMateModal";
import FestiMateForm from "../../components/FestiMateForm";

const MyProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [formValues, setFormValues] = useState({
    username: "",
    name: "",
    surname: "",
    email: "",
    city: "",
    country: "",
    profileImg: null,
  });
  const [formLoading, setFormLoading] = useState(false);

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
          profileImg: null,
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
          body: JSON.stringify(formValues),
        });
      }

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Update failed: ${res.status}`);
      }

      const updated = await res.json();
      setUserData(updated);
      setFormValues((prev) => ({ ...prev, profileImg: null }));
      setSuccess("Profile updated successfully ✅");
      setShowUpdateModal(false);
    } catch (err) {
      console.error(err);
      setError(err?.message || "Profile update failed ❌");
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) return <Spinner animation="grow" variant="none" className="spinner" />;
  if (!userData) return <Alert variant="warning">Profile not found</Alert>;

  const isPublicUser = !userData.role;

  const fields = [
    {
      id: "username",
      label: "Username",
      type: "text",
      value: formValues.username,
      onChange: (e) => setFormValues({ ...formValues, username: e.target.value }),
    },
    { id: "name", label: "Name", type: "text", value: formValues.name, onChange: (e) => setFormValues({ ...formValues, name: e.target.value }) },
    { id: "surname", label: "Surname", type: "text", value: formValues.surname, onChange: (e) => setFormValues({ ...formValues, surname: e.target.value }) },
    { id: "email", label: "Email", type: "email", value: formValues.email, onChange: (e) => setFormValues({ ...formValues, email: e.target.value }) },
    { id: "city", label: "City", type: "text", value: formValues.city, onChange: (e) => setFormValues({ ...formValues, city: e.target.value }) },
    { id: "country", label: "Country", type: "text", value: formValues.country, onChange: (e) => setFormValues({ ...formValues, country: e.target.value }) },
    {
      id: "profileImg",
      label: "Profile Image",
      type: "file",
      onChange: (e) => setFormValues({ ...formValues, profileImg: e.target.files[0] }),
    },
  ];

  return (
    <Container className="my-5 py-5">
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

            <Col xs={12} md={8}>
              <p className="p-form p-2 text-center">
                <strong className="me-2">Username:</strong> {userData.username}
              </p>
            </Col>
            <Col xs={12} md={8}>
              <p className="p-form p-2 text-center">
                <strong className="me-2">Name:</strong> {userData.name}
              </p>
            </Col>
            <Col xs={12} md={8}>
              <p className="p-form p-2 text-center">
                <strong className="me-2">Surname:</strong> {userData.surname}
              </p>
            </Col>
            <Col xs={12} md={8}>
              <p className="p-form p-2 text-center">
                <strong className="me-2">Email:</strong> {userData.email}
              </p>
            </Col>
            {userData.city && (
              <Col xs={12} md={8}>
                <p className="p-form p-2 f-4 text-center">
                  <strong className="me-2">City:</strong> {userData.city}
                </p>
              </Col>
            )}
            {userData.country && (
              <Col xs={12} md={8}>
                <p className="p-form p-2 text-center">
                  <strong className="me-2"> Country:</strong> {userData.country}
                </p>
              </Col>
            )}
          </Row>

          {isPublicUser && (
            <>
              <div className="mt-4 text-end">
                <Button
                  variant="none"
                  className="btn-festimate"
                  onClick={() => {
                    setSuccess("");
                    setError("");
                    setShowUpdateModal(true);
                  }}
                >
                  Update Profile
                </Button>
              </div>

              <FestiMateModal show={showUpdateModal} title="Update Profile">
                {success && <Alert variant="success">{success}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}

                <FestiMateForm fields={fields} onSubmit={handlePublicUserUpdate} submitLabel="Update Profile" loading={formLoading} />
              </FestiMateModal>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default MyProfile; */
}

import { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import FestiMatePatchField from "../../components/FestiMatePatchField";
import FestiMateModal from "../../components/FestiMateModal";
import FestiMateForm from "../../components/FestiMateForm";

const MyProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
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

  if (loading) return <Spinner animation="grow" variant="none" className="spinner" />;
  if (!userData) return <Alert variant="warning">Profile not found</Alert>;

  const isPublicUser = !userData.role;

  const fields = [
    {
      id: "username",
      label: "Username",
      type: "text",
      value: formValues.username,
      onChange: (e) => setFormValues({ ...formValues, username: e.target.value }),
    },
    { id: "name", label: "Name", type: "text", value: formValues.name, onChange: (e) => setFormValues({ ...formValues, name: e.target.value }) },
    { id: "surname", label: "Surname", type: "text", value: formValues.surname, onChange: (e) => setFormValues({ ...formValues, surname: e.target.value }) },
    { id: "email", label: "Email", type: "email", value: formValues.email, onChange: (e) => setFormValues({ ...formValues, email: e.target.value }) },
    { id: "city", label: "City", type: "text", value: formValues.city, onChange: (e) => setFormValues({ ...formValues, city: e.target.value }) },
    { id: "country", label: "Country", type: "text", value: formValues.country, onChange: (e) => setFormValues({ ...formValues, country: e.target.value }) },
  ];

  return (
    <Container className="mb-5 ">
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

            <Col xs={12} md={8}>
              <p className="p-form p-2 text-center">
                <strong className="me-2">Username:</strong> {userData.username}
              </p>
            </Col>
            <Col xs={12} md={8}>
              <p className="p-form p-2 text-center">
                <strong className="me-2">Name:</strong> {userData.name}
              </p>
            </Col>
            <Col xs={12} md={8}>
              <p className="p-form p-2 text-center">
                <strong className="me-2">Surname:</strong> {userData.surname}
              </p>
            </Col>
            <Col xs={12} md={8}>
              <p className="p-form p-2 text-center">
                <strong className="me-2">Email:</strong> {userData.email}
              </p>
            </Col>
            {userData.city && (
              <Col xs={12} md={8}>
                <p className="p-form p-2 f-4 text-center">
                  <strong className="me-2">City:</strong> {userData.city}
                </p>
              </Col>
            )}
            {userData.country && (
              <Col xs={12} md={8}>
                <p className="p-form p-2 text-center">
                  <strong className="me-2"> Country:</strong> {userData.country}
                </p>
              </Col>
            )}
          </Row>

          {isPublicUser && (
            <>
              <div className="mt-4 text-end">
                <Button
                  variant="none"
                  className="btn-festimate"
                  onClick={() => {
                    setSuccess("");
                    setError("");
                    setShowUpdateModal(true);
                  }}
                >
                  Update Profile
                </Button>
              </div>

              <FestiMateModal show={showUpdateModal} title="Update Profile" onClose={() => setShowUpdateModal(false)}>
                {success && <Alert variant="success">{success}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}

                <FestiMateForm fields={fields} onSubmit={handlePublicUserUpdate} submitLabel="Update Profile" loading={formLoading} />
              </FestiMateModal>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default MyProfile;
