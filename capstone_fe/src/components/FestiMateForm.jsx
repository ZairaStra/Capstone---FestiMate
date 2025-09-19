import { Form, Button } from "react-bootstrap";

const FestiMateForm = ({ fields = [], onSubmit, submitLabel = "Submit", loading }) => {
  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      {fields.map((field) => (
        <Form.Group className="mb-3" controlId={field.id} key={field.id}>
          {field.label && <Form.Label>{field.label}</Form.Label>}
          {field.type === "textarea" ? (
            <Form.Control as="textarea" rows={field.rows || 3} placeholder={field.placeholder || ""} value={field.value || ""} onChange={field.onChange} />
          ) : (
            <Form.Control type={field.type || "text"} placeholder={field.placeholder || ""} value={field.value || ""} onChange={field.onChange} />
          )}
        </Form.Group>
      ))}
      <Button type="submit" variant="none" className="btn-festimate" disabled={loading}>
        {loading ? "Loading..." : submitLabel}
      </Button>
    </Form>
  );
};

export default FestiMateForm;
