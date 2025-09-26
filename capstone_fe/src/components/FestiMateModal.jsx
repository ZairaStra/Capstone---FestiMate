import { Modal } from "react-bootstrap";

const FestiMateModal = ({ show, onClose, title, children }) => {
  return (
    <Modal show={show} onHide={onClose} size="md" centered>
      <Modal.Header closeButton onHide={onClose}>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>{children}</Modal.Body>
    </Modal>
  );
};

export default FestiMateModal;
