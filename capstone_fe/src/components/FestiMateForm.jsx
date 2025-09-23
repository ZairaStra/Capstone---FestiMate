//NON FUNZIONANTE PER BACKOFFICE - non supporta dowpdown
{
  /*import { Form } from "react-bootstrap";
import FestiMateButton from "./FestiMateButton";

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
      <FestiMateButton type="submit" disabled={loading}>
        {loading ? "Loading..." : submitLabel}
      </FestiMateButton>
    </Form>
  );
};

export default FestiMateForm;*/
}

import { Form } from "react-bootstrap";
import FestiMateButton from "./FestiMateButton";

const FestiMateForm = ({ fields = [], onSubmit, submitLabel = "Submit", loading }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = fields.reduce((acc, field) => {
      acc[field.id] = field.value;
      return acc;
    }, {});

    onSubmit(formData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      {fields.map((field) => (
        <Form.Group className="mb-3" controlId={field.id} key={field.id}>
          {field.label && <Form.Label>{field.label}</Form.Label>}

          {field.customComponent ? (
            field.customComponent
          ) : field.type === "textarea" ? (
            <Form.Control as="textarea" rows={field.rows || 3} placeholder={field.placeholder || ""} value={field.value || ""} onChange={field.onChange} />
          ) : field.type === "select" ? (
            <Form.Control as="select" value={field.value || ""} onChange={field.onChange}>
              <option value="">Select...</option>
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Form.Control>
          ) : (
            <Form.Control type={field.type || "text"} placeholder={field.placeholder || ""} value={field.value || ""} onChange={field.onChange} />
          )}
        </Form.Group>
      ))}

      <FestiMateButton type="submit" disabled={loading}>
        {loading ? "Loading..." : submitLabel}
      </FestiMateButton>
    </Form>
  );
};

export default FestiMateForm;
