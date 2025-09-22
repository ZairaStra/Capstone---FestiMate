//IMPAGINATO MA NON CAMBIA COLORE
{
  /*import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Alert } from "react-bootstrap";
import FestiMateForm from "../../components/FestiMateForm";
import FestiMateSpinner from "../../components/FestiMateSpinner";

const Reservation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const festivalId = location.state?.festivalId;

  const [festival, setFestival] = useState(null);
  const [campingSvg, setCampingSvg] = useState("");
  const [loadingFestival, setLoadingFestival] = useState(true);
  const [loadingCamping, setLoadingCamping] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tickets, setTickets] = useState(1);
  const [selectedCampingUnits, setSelectedCampingUnits] = useState([]); // contiene spotCode
  const [unitMap, setUnitMap] = useState({}); // spotCode -> id numerico

  useEffect(() => {
    if (!festivalId) {
      setError("Festival ID missing");
      setLoadingFestival(false);
      return;
    }

    const fetchFestival = async () => {
      try {
        const res = await fetch(`http://localhost:3002/festivals/${festivalId}`);
        if (!res.ok) throw new Error("Failed to fetch festival");
        const data = await res.json();
        setFestival(data);

        // costruiamo mappa spotCode -> id numerico dai campingUnits già inclusi
        const map = {};
        (data.campingUnits || []).forEach((u) => {
          if (u.spotCode && u.id) {
            map[u.spotCode] = u.id;
          }
        });
        setUnitMap(map);

        if (data.campingMap) {
          setLoadingCamping(true);
          try {
            const svgRes = await fetch(data.campingMap);
            if (!svgRes.ok) throw new Error("Failed to fetch camping map SVG");
            let svgText = await svgRes.text();

            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
            const unitElements = svgDoc.querySelectorAll("[id^='bungalow'], [id^='tent'], [id^='bubble']");

            unitElements.forEach((el) => {
              const unit = (data.campingUnits || []).find((u) => u.spotCode === el.id);
              const status = unit ? unit.status : "AVAILABLE";
              el.setAttribute("title", el.id);
              el.setAttribute("data-status", status);

              if (status === "OCCUPIED") {
                el.setAttribute("fill", "#888888");
                el.setAttribute("stroke", "#444444");
              } else {
                el.setAttribute("fill", "#e6e6fa");
                el.setAttribute("stroke", "#444444");
              }
            });

            svgText = new XMLSerializer().serializeToString(svgDoc);
            setCampingSvg(svgText);
          } catch (svgErr) {
            console.error("Error fetching camping SVG:", svgErr);
          } finally {
            setLoadingCamping(false);
          }
        }
      } catch (err) {
        setError(err.message || "Error fetching festival");
      } finally {
        setLoadingFestival(false);
      }
    };

    fetchFestival();
  }, [festivalId]);

  const handleReservation = async () => {
    setError("");
    setSuccess("");

    if (!festival || !startDate || !endDate) {
      setError("Please select start and end dates");
      return;
    }

    const campingIds = selectedCampingUnits.map((spotCode) => unitMap[spotCode]).filter((id) => id !== undefined && id !== null);

    try {
      const payload = {
        festivalId: festival.id,
        startDate,
        endDate,
        numTickets: tickets,
        totalPrice: tickets * festival.dailyPrice,
        campingUnitIds: campingIds,
      };

      const res = await fetch("http://localhost:3002/reservations/me/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Reservation failed");
      }

      setSuccess("Reservation successful!");
      setTimeout(() => navigate("/reservations/me"), 2000);
    } catch (err) {
      setError(err.message || "Reservation failed");
    }
  };

  const handleCampingClick = (e) => {
    const unitId = e.target.id;
    const status = e.target.getAttribute("data-status");
    if (!unitId || status === "OCCUPIED") return;

    setSelectedCampingUnits((prev) => {
      const newSelected = prev.includes(unitId) ? prev.filter((id) => id !== unitId) : [...prev, unitId];

      const el = e.target;
      if (newSelected.includes(unitId)) {
        el.setAttribute("fill", "#20b2aa");
        el.setAttribute("stroke", "#20b2aa");
      } else {
        el.setAttribute("fill", "#e6e6fa");
        el.setAttribute("stroke", "#444444");
      }

      return newSelected;
    });
  };

  if (loadingFestival) return <FestiMateSpinner />;
  if (error && !festival) return <Alert variant="danger">{error}</Alert>;
  if (!festival) return <Alert variant="warning">Festival not found</Alert>;

  const fields = [
    {
      id: "startDate",
      label: "Start Date",
      type: "date",
      value: startDate,
      onChange: (e) => setStartDate(e.target.value),
    },
    {
      id: "endDate",
      label: "End Date",
      type: "date",
      value: endDate,
      onChange: (e) => setEndDate(e.target.value),
    },
    {
      id: "tickets",
      label: "Number of Tickets",
      type: "number",
      value: tickets,
      onChange: (e) => setTickets(Math.min(Number(e.target.value), festival.maxNumbPartecipants)),
    },
  ];

  return (
    <Container className="my-5" style={{ minHeight: "80vh" }}>
      {loadingFestival && <FestiMateSpinner />}

      {error && !festival}
      {success && <Alert variant="success">{success}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mb-4">
        <Col xs={12} sm={6}>
          <h3 className="display-4 pb-4">
            Book your tickets for <strong>{festival.name}</strong>
          </h3>
        </Col>
        <Col>
          <p className="p-form p-3">
            Dates: {festival.startDate} – {festival.endDate} <br />
            Daily Price: ${festival.dailyPrice} <br />
            Capacity Left: {festival.maxNumbPartecipants}
          </p>
        </Col>
      </Row>

      <Row className="g-4">
        <Col xs={12} md={6}>
          <FestiMateForm fields={fields} onSubmit={handleReservation} submitLabel="Confirm Reservation" />

          {!loadingCamping && campingSvg && (
            <>
              <h5 className="mt-4">Camping Legend & Selection</h5>
              <Row>
                <Col>
                  <ul className="legend-list">
                    <li>
                      <span className="legend-shape triangle" /> Tent
                    </li>
                    <li>
                      <span className="legend-shape circle" /> Bubble Tent
                    </li>
                    <li>
                      <span className="legend-shape rectangle" /> Bungalow
                    </li>
                  </ul>
                </Col>
                <Col>
                  <ul>
                    <li>
                      <span className="legend-color selected" /> Selected
                    </li>
                    <li>
                      <span className="legend-color available" /> Available
                    </li>
                    <li>
                      <span className="legend-color occupied" /> Occupied
                    </li>
                  </ul>
                </Col>
              </Row>
              {selectedCampingUnits.length > 0 && <p className="mt-2 p-2 p-form">Selected Units: {selectedCampingUnits.join(", ")}</p>}
            </>
          )}
        </Col>

        <Col xs={12} md={6}>
          {loadingCamping && <FestiMateSpinner />}
          {!loadingCamping && campingSvg && (
            <div
              className="camping-map-wrapper"
              dangerouslySetInnerHTML={{ __html: campingSvg }}
              onClick={handleCampingClick}
              style={{ maxWidth: "100%", cursor: "pointer" }}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Reservation;*/
}

//INTERATTIVO MA SPAGINATO
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Alert } from "react-bootstrap";
import FestiMateForm from "../../components/FestiMateForm";
import FestiMateSpinner from "../../components/FestiMateSpinner";

const Reservation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const festivalId = location.state?.festivalId;

  const [festival, setFestival] = useState(null);
  const [loadingFestival, setLoadingFestival] = useState(true);
  const [loadingCamping, setLoadingCamping] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tickets, setTickets] = useState(1);
  const [selectedCampingUnits, setSelectedCampingUnits] = useState([]); // spotCode
  const [campingUnits, setCampingUnits] = useState([]);
  const [spotCodeToId, setSpotCodeToId] = useState({}); // mappa spotCode -> id numerico
  const [svgViewBox, setSvgViewBox] = useState("0 0 800 600");

  useEffect(() => {
    if (!festivalId) {
      setError("Festival ID missing");
      setLoadingFestival(false);
      return;
    }

    const fetchFestival = async () => {
      try {
        const res = await fetch(`http://localhost:3002/festivals/${festivalId}`);
        if (!res.ok) throw new Error("Failed to fetch festival");
        const data = await res.json();
        setFestival(data);

        const unitsData = data.campingUnits || [];

        // costruisco mappa spotCode -> id numerico
        const spotMap = {};
        unitsData.forEach((u) => {
          if (u.spotCode && u.id) spotMap[u.spotCode] = u.id;
        });
        setSpotCodeToId(spotMap);

        if (data.campingMap) {
          setLoadingCamping(true);
          try {
            const svgRes = await fetch(data.campingMap);
            if (!svgRes.ok) throw new Error("Failed to fetch camping map SVG");
            const svgText = await svgRes.text();

            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
            const svgEl = svgDoc.querySelector("svg");
            if (svgEl) setSvgViewBox(svgEl.getAttribute("viewBox") || "0 0 800 600");

            const unitElements = Array.from(svgDoc.querySelectorAll("[id^='bungalow'], [id^='tent'], [id^='bubble']"));

            const units = unitElements.map((el) => {
              const unitData = unitsData.find((u) => u.spotCode === el.id);
              const status = unitData?.status || "AVAILABLE";
              return {
                spotCode: el.id,
                id: unitData?.id || null,
                type: el.tagName.toLowerCase(),
                status,
                d: el.getAttribute("d") || "",
                x: parseFloat(el.getAttribute("x") || 0),
                y: parseFloat(el.getAttribute("y") || 0),
                width: parseFloat(el.getAttribute("width") || 20),
                height: parseFloat(el.getAttribute("height") || 20),
                cx: parseFloat(el.getAttribute("cx") || 0),
                cy: parseFloat(el.getAttribute("cy") || 0),
                r: parseFloat(el.getAttribute("r") || 0),
              };
            });

            setCampingUnits(units);
          } catch (svgErr) {
            console.error("Error fetching camping SVG:", svgErr);
          } finally {
            setLoadingCamping(false);
          }
        }
      } catch (err) {
        setError(err.message || "Error fetching festival");
      } finally {
        setLoadingFestival(false);
      }
    };

    fetchFestival();
  }, [festivalId]);

  const handleCampingClick = (spotCode) => {
    setSelectedCampingUnits((prev) => (prev.includes(spotCode) ? prev.filter((s) => s !== spotCode) : [...prev, spotCode]));
  };

  const handleReservation = async () => {
    setError("");
    setSuccess("");

    if (!festival || !startDate || !endDate) {
      setError("Please select start and end dates");
      return;
    }

    try {
      const campingIds = selectedCampingUnits.map((spot) => spotCodeToId[spot]).filter((id) => id != null);

      const payload = {
        festivalId: festival.id,
        startDate,
        endDate,
        numTickets: tickets,
        totalPrice: tickets * festival.dailyPrice,
        campingUnitIds: campingIds,
      };

      const res = await fetch("http://localhost:3002/reservations/me/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Reservation failed");
      }

      setSuccess("Reservation successful!");
      setTimeout(() => navigate("/me/reservations"), 2000);
    } catch (err) {
      setError(err.message || "Reservation failed");
    }
  };

  if (loadingFestival) return <FestiMateSpinner />;
  if (error && !festival) return <Alert variant="danger">{error}</Alert>;
  if (!festival) return <Alert variant="warning">Festival not found</Alert>;

  const fields = [
    { id: "startDate", label: "Start Date", type: "date", value: startDate, onChange: (e) => setStartDate(e.target.value) },
    { id: "endDate", label: "End Date", type: "date", value: endDate, onChange: (e) => setEndDate(e.target.value) },
    {
      id: "tickets",
      label: "Number of Tickets",
      type: "number",
      value: tickets,
      onChange: (e) => setTickets(Math.min(Number(e.target.value), festival.maxNumbPartecipants)),
    },
  ];

  return (
    <Container className="mb-5" style={{ minHeight: "80vh" }}>
      {success && <Alert variant="success">{success}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mb-4 align-items-center">
        <Col>
          <h2 className="my-5 display-3">
            Book your tickets for <strong>{festival.name}</strong>
          </h2>
          <p className="p-form p-3">
            Dates: {festival.startDate} – {festival.endDate} <br />
            Daily Price: ${festival.dailyPrice} <br />
            Capacity Left: {festival.maxNumbPartecipants}
          </p>
        </Col>
      </Row>

      <Row className="g-4">
        <Col xs={12} md={6}>
          <FestiMateForm fields={fields} onSubmit={handleReservation} submitLabel="Confirm Reservation" />

          {!loadingCamping && campingUnits.length > 0 && (
            <>
              <h5 className="mt-4">Camping Legend & Selection</h5>
              <ul className="legend-list">
                <li>
                  <span className="legend-shape triangle" /> Tent
                </li>
                <li>
                  <span className="legend-shape circle" /> Bubble Tent
                </li>
                <li>
                  <span className="legend-shape rectangle" /> Bungalow
                </li>
                <li>
                  <span className="legend-color selected" /> Selected
                </li>
                <li>
                  <span className="legend-color available" /> Available
                </li>
                <li>
                  <span className="legend-color occupied" /> Occupied
                </li>
              </ul>
              {selectedCampingUnits.length > 0 && <p className="mt-2 p-2 p-form">Selected Units: {selectedCampingUnits.join(", ")}</p>}
            </>
          )}
        </Col>

        <Col xs={12} md={6}>
          {loadingCamping && <FestiMateSpinner />}
          {!loadingCamping && campingUnits.length > 0 && (
            <div className="camping-map-wrapper">
              <svg width="100%" height="600" viewBox={svgViewBox} style={{ border: "1px solid #ccc", cursor: "pointer" }}>
                {campingUnits.map((unit) => {
                  const isSelected = selectedCampingUnits.includes(unit.spotCode);
                  let fillColor = unit.status === "OCCUPIED" ? "#888888" : "#e6e6fa";
                  if (isSelected) fillColor = "#20b2aa";

                  if (unit.type === "rect") {
                    return (
                      <rect
                        key={unit.spotCode}
                        x={unit.x}
                        y={unit.y}
                        width={unit.width}
                        height={unit.height}
                        fill={fillColor}
                        stroke={fillColor}
                        onClick={() => handleCampingClick(unit.spotCode)}
                      />
                    );
                  } else if (unit.type === "circle") {
                    return (
                      <circle
                        key={unit.spotCode}
                        cx={unit.cx}
                        cy={unit.cy}
                        r={unit.r}
                        fill={fillColor}
                        stroke={fillColor}
                        onClick={() => handleCampingClick(unit.spotCode)}
                      />
                    );
                  } else if (unit.type === "path") {
                    return <path key={unit.spotCode} d={unit.d} fill={fillColor} stroke={fillColor} onClick={() => handleCampingClick(unit.spotCode)} />;
                  }
                  return null;
                })}
              </svg>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Reservation;
