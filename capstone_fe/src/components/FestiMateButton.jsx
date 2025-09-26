import React from "react";
import { Button } from "react-bootstrap";

const FestiMateButton = ({ children, onClick, variant = "none", className = "", disabled = false, type = "button", iconBefore, iconAfter, ...props }) => {
  return (
    <Button type={type} onClick={onClick} variant={variant} className={`btn-festimate rounded-pill ${className}`} disabled={disabled} {...props}>
      {iconBefore && <span className="me-2">{iconBefore}</span>}
      {children}
      {iconAfter && <span className="ms-2">{iconAfter}</span>}
    </Button>
  );
};

export default FestiMateButton;
