import { useState, useEffect } from "react";
import { Button, Form, Spinner, Row, Col, Alert } from "react-bootstrap";
import FestiMateModal from "./FestiMateModal";

const FestiMatePatchField = ({ label, value, type, onPatch }) => {
  const [showModal, setShowModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!showModal) {
      setOldPassword("");
      setInputValue("");
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
      if (type === "file" && file) {
        await onPatch(file);
      } else if (type === "password") {
        if (!oldPassword || !inputValue) throw new Error("Both old and new password required");
        await onPatch({ oldPassword, newPassword: inputValue });
      }

      setSuccess("Password update successfully!");
    } catch (err) {
      console.error("Errore PATCH field:", err);
      setError("Update failed, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row className="align-items-end g-3">
      <Col xs={10}>
        <strong className="me-3">{label}</strong>
        {type === "file" ? (
          <img
            src={value}
            alt={label}
            className="img-fluid rounded border"
            style={{ maxWidth: "150px", minWidth: "80px", height: "auto", objectFit: "cover" }}
          />
        ) : type === "password" ? (
          <span>••••••••</span>
        ) : null}
      </Col>
      <Col xs={2}>
        <Button variant="link" className="links p-0" onClick={() => setShowModal(true)}>
          <i className="bi bi-pencil-fill"></i>
        </Button>
      </Col>

      <FestiMateModal
        show={showModal}
        onClose={() => setShowModal(false)}
        title={`Update ${label}`}
        footer={
          <>
            <Button variant="none" className="btn-festimate" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="none" className="btn-festimate" onClick={handleSave} disabled={loading}>
              {loading ? <Spinner animation="grow" className="spinner" /> : "Save"}
            </Button>
          </>
        }
      >
        {success && <Alert variant="success">{success}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        {type === "file" ? (
          <Form.Control type="file" onChange={(e) => setFile(e.target.files[0])} />
        ) : type === "password" ? (
          <>
            <Form.Control type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder="Old password" className="mb-3" />
            <Form.Control type="password" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="New password" />
          </>
        ) : null}
      </FestiMateModal>
    </Row>
  );
};

export default FestiMatePatchField;
