import { useState, useEffect } from "react";

const FestiMateInteractiveCampingMap = ({ svgString, campingUnits, selectedUnits, setSelectedUnits }) => {
  const [parsedElements, setParsedElements] = useState([]);
  const [viewBox, setViewBox] = useState("0 0 2500 1600");

  useEffect(() => {
    if (!svgString) return;
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgString, "image/svg+xml");
    const svgEl = svgDoc.querySelector("svg");
    if (svgEl) setViewBox(svgEl.getAttribute("viewBox") || "0 0 2500 1600");

    const units = Array.from(svgEl.querySelectorAll("[id^='bungalow'], [id^='tent'], [id^='bubble']"));
    setParsedElements(
      units.map((el) => {
        const spotCode = el.id;
        const unit = campingUnits.find((u) => u.spotCode === spotCode);
        return {
          id: spotCode,
          unitId: unit?.id,
          tag: el.tagName,
          attributes: Array.from(el.attributes).reduce((acc, attr) => {
            acc[attr.name] = attr.value;
            return acc;
          }, {}),
          status: unit ? unit.status : "AVAILABLE",
        };
      })
    );
  }, [svgString, campingUnits]);

  console.log("Parsed elements:", parsedElements);
  console.log("Camping units:", campingUnits);
  console.log("Selected units:", selectedUnits);

  const handleClick = (spotCode, status) => {
    if (status === "OCCUPIED") return;

    const unit = campingUnits.find((u) => u.spotCode === spotCode);
    if (!unit || !unit.id) return;

    const unitId = unit.id;

    setSelectedUnits((prev) => (prev.includes(unitId) ? prev.filter((id) => id !== unitId) : [...prev, unitId]));
  };

  const convertAttributes = (attrs) => {
    const mapping = {
      "stroke-width": "strokeWidth",
      "stroke-linecap": "strokeLinecap",
      "stroke-linejoin": "strokeLinejoin",
      "fill-rule": "fillRule",
    };

    return Object.fromEntries(Object.entries(attrs).map(([key, value]) => [mapping[key] || key, value]));
  };

  return (
    <div style={{ width: "100%", overflow: "hidden" }}>
      <svg viewBox={viewBox} style={{ width: "100%", height: "auto", display: "block" }}>
        {parsedElements.map(({ id, unitId, tag, attributes, status }) => {
          const selected = selectedUnits.includes(unitId);
          const fill = status === "OCCUPIED" ? "#888888" : selected ? "#20b2aa" : "#e6e6fa";
          const stroke = selected ? "#20b2aa" : "#444444";

          const cleanedAttributes = convertAttributes(attributes);

          return tag === "rect" ? (
            <rect
              key={id}
              {...cleanedAttributes}
              fill={fill}
              stroke={stroke}
              onClick={() => handleClick(id, status)}
              style={{ cursor: status !== "OCCUPIED" ? "pointer" : "not-allowed" }}
            />
          ) : (
            <path
              key={id}
              {...cleanedAttributes}
              fill={fill}
              stroke={stroke}
              onClick={() => handleClick(id, status)}
              style={{ cursor: status !== "OCCUPIED" ? "pointer" : "not-allowed" }}
            />
          );
        })}
      </svg>
    </div>
  );
};

export default FestiMateInteractiveCampingMap;
