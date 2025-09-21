import { useState, useEffect } from "react";
import { Button, Form, Alert, Row, Col } from "react-bootstrap";
import FestiMateModal from "./FestiMateModal";
import FestiMateSpinner from "./FestiMateSpinner";
import FestiMateButton from "./FestiMateButton";

const FestiMatePatchField = ({ label, value, type = "text", onPatch }) => {
  const [showModal, setShowModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!showModal) {
      setOldPassword("");
      setNewPassword("");
      setFile(null);
      setLoading(false);
      setSuccess("");
      setError("");
    }
  }, [showModal]);

  const handleSave = async () => {
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      if (type === "file") {
        if (!file) throw new Error("No file selected");
        await onPatch(file);
        setSuccess("Profile image updated successfully");
      } else if (type === "password") {
        if (!oldPassword || !newPassword) throw new Error("Both old and new password are required");
        await onPatch({ oldPassword, newPassword });
        setSuccess("Password updated successfully");
      }
    } catch (err) {
      console.error("Error PATCH field:", err);
      setError(err?.message || "Update failed, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Row className="align-items-end g-3">
        <Col className="d-flex align-items-end justify-content-between">
          <div className="d-flex align-items-end gap-2">
            <strong>{label}</strong>
            {type === "file" && value ? (
              <img
                src={value}
                alt={label}
                className="img-fluid rounded border"
                style={{ maxWidth: "150px", minWidth: "80px", height: "auto", objectFit: "cover" }}
              />
            ) : type === "password" ? (
              <span>••••••••</span>
            ) : null}
          </div>

          <Button variant="link" className="links" onClick={() => setShowModal(true)}>
            <i className="bi bi-pencil-fill"></i>
          </Button>
        </Col>
      </Row>

      <FestiMateModal show={showModal} onClose={() => setShowModal(false)} title={`Update ${label || ""}`}>
        {success && <Alert variant="success">{success}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        {type === "file" ? (
          <>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => {
                setFile(e.target.files && e.target.files[0] ? e.target.files[0] : null);
                setSuccess("");
                setError("");
              }}
            />
            <div className="mt-3 text-end">
              <FestiMateButton onClick={handleSave} disabled={loading}>
                {loading ? <FestiMateSpinner /> : "Save"}
              </FestiMateButton>
            </div>
          </>
        ) : type === "password" ? (
          <>
            <Form.Control type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder="Old password" className="mb-3" />
            <Form.Control type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New password" />
            <div className="mt-3 text-end">
              <FestiMateButton onClick={handleSave} disabled={loading}>
                {loading ? <FestiMateSpinner /> : "Save"}
              </FestiMateButton>
            </div>
          </>
        ) : null}
      </FestiMateModal>
    </>
  );
};

export default FestiMatePatchField;
