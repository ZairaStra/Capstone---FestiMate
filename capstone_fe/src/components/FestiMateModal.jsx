import { Modal, Button } from "react-bootstrap";

const FestiMateModal = ({ show, onClose, title, children, footer }) => {
  return (
    <Modal show={show} onHide={onClose} size="md" centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>{children}</Modal.Body>

      <Modal.Footer>
        {footer ? (
          footer
        ) : (
          <Button variant="none" className="btn-festimate" onClick={onClose}>
            Close
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default FestiMateModal;
