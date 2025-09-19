import { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import FestiMatePatchField from "../../components/FestiMatePatchField";

const MyProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const token = localStorage.getItem("token");

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3002/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setUserData(data);
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchUserData();
    else setLoading(false);
  }, [token]);

  const handlePatch = async (field, value) => {
    try {
      let res, data;
      if (field === "profileImg") {
        const formData = new FormData();
        formData.append("image", value);
        res = await fetch("http://localhost:3002/users/me/profileImg", {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        if (!res.ok) throw new Error(`Profile image update failed: ${res.status}`);
        data = await res.json();
        setUserData((prev) => ({ ...prev, profileImg: data.profileImg }));
      } else if (field === "password") {
        res = await fetch("http://localhost:3002/users/me/password", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(value),
        });
        if (!res.ok) throw new Error(`Password update failed: ${res.status}`);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  if (loading) return <Spinner animation="grow" variant="none" className="spinner" />;
  if (!userData) return <p>Profile not found</p>;

  const isPublicUser = !userData.role;

  return (
    <Container className="my-5 py-5">
      <Row className="justify-content-center g-2">
        <Col xs={12} md={8}>
          <h2 className="display-3 mt-5">My Profile</h2>
          <Row className="g-4 justify-content-center">
            <Col xs={12} md={8}>
              <Row className="justify-content-between align-items-end">
                <Col xs={12} sm={6}>
                  <FestiMatePatchField label="Password" type="password" className="order-2 order-md-1" value="" onPatch={(pw) => handlePatch("password", pw)} />
                </Col>
                <Col xs={12} sm={6}>
                  <FestiMatePatchField
                    label=""
                    type="file"
                    className="order-1 order-md-2"
                    value={userData.profileImg}
                    onPatch={(file) => handlePatch("profileImg", file)}
                  />
                </Col>
              </Row>
            </Col>
            <Col xs={12} md={8}>
              <p className="p-form p-2  text-center">
                <strong>Username:</strong> {userData.username}
              </p>
            </Col>
            <Col xs={12} md={8}>
              <p className="p-form p-2  text-center">
                <strong>Name:</strong> {userData.name}
              </p>
            </Col>
            <Col xs={12} md={8}>
              <p className="p-form p-2  text-center">
                <strong>Surname:</strong> {userData.surname}
              </p>
            </Col>
            <Col xs={12} md={8}>
              <p className="p-form p-2  text-center">
                <strong>Email:</strong> {userData.email}
              </p>
            </Col>
            {userData.city && (
              <Col xs={12}>
                <p className="p-form p-2 f-4 text-center">
                  <strong>City:</strong> {userData.city}
                </p>
              </Col>
            )}
            {userData.country && (
              <Col xs={12}>
                <p className="p-form p-2">
                  <strong>Country:</strong> {userData.country}
                </p>
              </Col>
            )}
          </Row>

          {isPublicUser && (
            <div className="mt-4 text-end">
              <Button variant="none" className="btn-festimate" onClick={() => setShowUpdateModal(true)}>
                Update Profile
              </Button>
            </div>
          )}

          {showUpdateModal && <p>MODALE PUT PER PUBLIC USER DA IMPLEMENTARE</p>}
        </Col>
      </Row>
    </Container>
  );
};

export default MyProfile;
