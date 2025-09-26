import { useState, useEffect } from "react";
import { Button, Form, Alert, Row, Col } from "react-bootstrap";
import FestiMateModal from "./FestiMateModal";
import FestiMateSpinner from "./FestiMateSpinner";
import FestiMateButton from "./FestiMateButton";

const FestiMatePatchField = ({ label, value, type = "text", onPatch }) => {
  const [showModal, setShowModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!showModal) {
      setOldPassword("");
      setNewPassword("");
      setNewPrice(type === "price" ? value || "" : "");
      setFile(null);
      setLoading(false);
      setSuccess("");
      setError("");
    } else if (type === "price" && value) {
      setNewPrice(value.toString());
    }
  }, [showModal, type, value]);

  const handleSave = async () => {
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      if (type === "file") {
        if (!file) throw new Error("No file selected");
        await onPatch(file);
        setSuccess("File updated successfully");
      } else if (type === "password") {
        if (!oldPassword || !newPassword) throw new Error("Both old and new password are required");
        if (oldPassword === newPassword) throw new Error("New password must be different from old password");
        await onPatch({ oldPassword, newPassword });
        setSuccess("Password updated successfully");
      } else if (type === "price") {
        if (!newPrice || isNaN(parseFloat(newPrice))) throw new Error("Please enter a valid price");
        const priceValue = parseFloat(newPrice);
        if (priceValue < 0) throw new Error("Price cannot be negative");
        await onPatch({ oldPrice: value, newPrice: priceValue });
        setSuccess("Price updated successfully");
      }
    } catch (err) {
      console.error("Error PATCH field:", err);
      setError(err?.message || "Update failed, please try again");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSuccess("");
    setError("");
  };

  const renderValue = () => {
    if (type === "file" && value) {
      return (
        <img
          src={value}
          alt={label || "Image"}
          className="img-fluid rounded border"
          style={{ maxWidth: "150px", minWidth: "80px", height: "auto", objectFit: "cover" }}
        />
      );
    } else if (type === "password") {
      return <span className="text-muted">••••••••</span>;
    } else if (type === "price") {
      return <span>€{value || "0.00"}</span>;
    }
    return null;
  };

  return (
    <>
      <Row className="align-items-end gy-4">
        <Col className="align-items-end justify-content-between">
          <div className="d-flex align-items-end justify-content-end gap-2">
            <strong>{label}</strong>
            {renderValue()}
            <Button variant="link" className="card-links" onClick={() => setShowModal(true)}>
              <i className="bi bi-pencil-fill"></i>
            </Button>
          </div>
        </Col>
      </Row>

      <FestiMateModal show={showModal} onClose={handleCloseModal} title={`Update ${label || type}`}>
        {success && <Alert variant="success">{success}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        {type === "file" && (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Select new file</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => {
                  setFile(e.target.files && e.target.files[0] ? e.target.files[0] : null);
                  setSuccess("");
                  setError("");
                }}
              />
              {file && (
                <div className="mt-2">
                  <small className="text-muted">Selected: {file.name}</small>
                </div>
              )}
            </Form.Group>
            <div className="d-flex justify-content-end">
              <FestiMateButton variant="secondary" className="me-2" onClick={handleCloseModal}>
                Cancel
              </FestiMateButton>
              <FestiMateButton onClick={handleSave} disabled={loading || !file}>
                {loading ? <FestiMateSpinner /> : "Save"}
              </FestiMateButton>
            </div>
          </Form>
        )}

        {type === "password" && (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                type="password"
                value={oldPassword}
                onChange={(e) => {
                  setOldPassword(e.target.value);
                  setSuccess("");
                  setError("");
                }}
                placeholder="Enter current password"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setSuccess("");
                  setError("");
                }}
                placeholder="Enter new password"
              />
            </Form.Group>
            <div className="d-flex justify-content-end">
              <FestiMateButton variant="secondary" className="me-2" onClick={handleCloseModal}>
                Cancel
              </FestiMateButton>
              <FestiMateButton onClick={handleSave} disabled={loading || !oldPassword || !newPassword}>
                {loading ? <FestiMateSpinner /> : "Save"}
              </FestiMateButton>
            </div>
          </Form>
        )}

        {type === "price" && (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Current Price</Form.Label>
              <Form.Control type="text" value={`€${value || "0.00"}`} disabled className="bg-light" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>New Price</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                min="0"
                value={newPrice}
                onChange={(e) => {
                  setNewPrice(e.target.value);
                  setSuccess("");
                  setError("");
                }}
                placeholder="Enter new price"
              />
            </Form.Group>
            <div className="d-flex justify-content-end">
              <FestiMateButton variant="secondary" className="me-2" onClick={handleCloseModal}>
                Cancel
              </FestiMateButton>
              <FestiMateButton onClick={handleSave} disabled={loading || !newPrice || isNaN(parseFloat(newPrice))}>
                {loading ? <FestiMateSpinner /> : "Save"}
              </FestiMateButton>
            </div>
          </Form>
        )}
      </FestiMateModal>
    </>
  );
};

export default FestiMatePatchField;
