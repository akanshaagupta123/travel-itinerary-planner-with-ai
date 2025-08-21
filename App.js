import React, { useMemo, useState } from "react";
import "./App.css";

const INDIAN_CITIES = [
  "delhi","new delhi","mumbai","bombay","pune","bangalore","bengaluru","chennai","kolkata","jaipur","agra","goa","hyderabad","ahmedabad","varanasi","kochi","cochin","manali","shimla","udaipur","jodhpur","rishikesh","ooty","mysore","darjeeling","pondicherry","amritsar"
];

const PLACE_PHOTOS = {
  paris: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2000&auto=format&fit=crop",
  rome: "https://images.unsplash.com/photo-1526481280698-8fcc13fd1f1b?q=80&w=2000&auto=format&fit=crop",
  barcelona: "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?q=80&w=2000&auto=format&fit=crop",
  london: "https://images.unsplash.com/photo-1464790719320-516ecd75af6c?q=80&w=2000&auto=format&fit=crop",
  tokyo: "https://images.unsplash.com/photo-1518544801976-3e188ea8a98a?q=80&w=2000&auto=format&fit=crop",
  bali: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2000&auto=format&fit=crop",
  goa: "https://images.unsplash.com/photo-1544551763-7ef4200e8d6b?q=80&w=2000&auto=format&fit=crop",
  delhi: "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=2000&auto=format&fit=crop",
  jaipur: "https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?q=80&w=2000&auto=format&fit=crop",
  mumbai: "https://images.unsplash.com/photo-1548013146-21c83e2a85a6?q=80&w=2000&auto=format&fit=crop",
  default: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2000&auto=format&fit=crop",
};

const CITY_ACTIVITIES = {
  paris: [
    "Eiffel Tower & Trocadéro photos",
    "Seine River cruise",
    "Louvre (skip-the-line morning)",
    "Montmartre sunset + Sacré-Cœur",
    "Boulangerie crawl: croissant & café crème",
    "Latin Quarter bistro dinner",
  ],
  rome: [
    "Colosseum + Roman Forum",
    "Pantheon & Piazza Navona",
    "Vatican Museums & St. Peter’s",
    "Trastevere food walk",
    "Trevi Fountain & gelato stop",
    "Sunset at Pincio Terrace",
  ],
  barcelona: [
    "Sagrada Família (AM slot)",
    "Gothic Quarter wander",
    "Park Güell golden hour",
    "Tapas crawl in El Born",
    "La Boqueria market brunch",
    "Beach walk at Barceloneta",
  ],
  london: [
    "Westminster & Big Ben",
    "Thames walk + London Eye",
    "British Museum highlights",
    "Borough Market food tour",
    "Tower Bridge & Tower of London",
    "Soho theatre evening",
  ],
  tokyo: [
    "Asakusa & Sensō-ji",
    "Shibuya Crossing & Hachikō",
    "Meiji Shrine + Harajuku",
    "TeamLab Planets (slots)",
    "Sushi counter experience",
    "Odaiba night skyline",
  ],
  bali: [
    "Ubud rice terraces",
    "Tegallalang swing",
    "Uluwatu temple sunset",
    "Nusa Penida day trip",
    "Waterfall & cafe hop",
    "Beach club chill",
  ],
  goa: [
    "Baga/Calangute beach time",
    "Aguada Fort & lighthouse",
    "Candolim seafood lunch",
    "Chapora sunset point",
    "Old Goa churches",
    "Night market & music",
  ],
  delhi: [
    "Red Fort & Chandni Chowk",
    "Rickshaw to Jama Masjid",
    "India Gate & Rajpath",
    "Humayun’s Tomb",
    "Qutub Minar",
    "Connaught Place food crawl",
  ],
  jaipur: [
    "Amber Fort & Panna Meena",
    "City Palace & Jantar Mantar",
    "Hawa Mahal photos",
    "Bapu Bazaar shopping",
    "Chokhi Dhani dinner",
    "Nahargarh sunset",
  ],
  mumbai: [
    "Gateway of India & Colaba",
    "Ferry to Elephanta Caves",
    "Kala Ghoda art walk",
    "Marine Drive sunset",
    "Bandra cafes & street art",
    "Juhu beach snacks",
  ],
  default: [
    "Old town walking tour",
    "Top viewpoint / sunset spot",
    "Local market tasting",
    "Museum or landmark",
    "Park / waterfront stroll",
    "Signature restaurant dinner",
  ],
};

function titleCase(s) {
  return (s || "")
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

function guessKey(place) {
  if (!place) return "default";
  const p = place.trim().toLowerCase();
  if (PLACE_PHOTOS[p]) return p;
  if (p.includes("new delhi")) return "delhi";
  if (p.includes("bengaluru") || p.includes("bangalore")) return "mumbai"; // fallback Indian urban
  if (p.includes("barca")) return "barcelona";
  if (p.includes("bali")) return "bali";
  return p.split(",")[0] || "default";
}

function getPhoto(place) {
  const key = guessKey(place);
  return PLACE_PHOTOS[key] || PLACE_PHOTOS.default;
}

function getActivities(place) {
  const key = guessKey(place);
  return CITY_ACTIVITIES[key] || CITY_ACTIVITIES.default;
}

function isDomestic(place) {
  const p = (place || "").toLowerCase();
  return INDIAN_CITIES.some((c) => p.includes(c));
}

function App() {
  const [place, setPlace] = useState("");
  const [days, setDays] = useState(3);
  const [style, setStyle] = useState("comfort"); // budget | comfort | luxury
  const [plan, setPlan] = useState(null);

  const hero = useMemo(() => getPhoto(place || "default"), [place]);

  const generatePlan = () => {
    if (!place || !days || days < 1) {
      alert("Please enter a destination and number of days (≥ 1).");
      return;
    }

    const dom = isDomestic(place);
    // 💰 Realistic-ish budgeting in INR
    const flight = dom ? 6000 + days * 300 : 45000 + days * 1000; // ballpark
    const nightly =
      style === "budget" ? 1800 : style === "comfort" ? 3200 : 7500;
    const hotel = nightly * days;
    const foodPerDay = style === "budget" ? 700 : style === "comfort" ? 1200 : 2500;
    const food = foodPerDay * days;
    const localPerDay = dom ? 400 : 900;
    const localTransport = localPerDay * days;
    const activitiesPerDay =
      style === "budget" ? 400 : style === "comfort" ? 800 : 1500;
    const activities = activitiesPerDay * days;
    const buffer = Math.round(0.1 * (flight + hotel + food + localTransport + activities));

    const total =
      flight + hotel + food + localTransport + activities + buffer;

    // 🗺️ Build itinerary with photos and editable activities
    const base = getActivities(place);
    const daily = Array.from({ length: days }, (_, i) => {
      const picks = [
        base[i % base.length],
        base[(i + 1) % base.length],
        base[(i + 2) % base.length],
      ];
      return {
        day: i + 1,
        location: titleCase(place),
        photo: getPhoto(place),
        activities: picks,
      };
    });

    setPlan({
      place: titleCase(place),
      days,
      style,
      budget: {
        flight,
        hotel,
        food,
        localTransport,
        activities,
        buffer,
        total,
      },
      itinerary: daily,
    });
  };

  const updateActivity = (dIndex, aIndex, value) => {
    setPlan((prev) => {
      const next = structuredClone(prev);
      next.itinerary[dIndex].activities[aIndex] = value;
      return next;
    });
  };

  const addActivity = (dIndex) => {
    setPlan((prev) => {
      const next = structuredClone(prev);
      next.itinerary[dIndex].activities.push("New activity…");
      return next;
    });
  };

  const removeActivity = (dIndex, aIndex) => {
    setPlan((prev) => {
      const next = structuredClone(prev);
      next.itinerary[dIndex].activities.splice(aIndex, 1);
      return next;
    });
  };

  const addDay = () => {
    setPlan((prev) => {
      const next = structuredClone(prev);
      const i = next.itinerary.length;
      next.itinerary.push({
        day: i + 1,
        location: next.place,
        photo: getPhoto(next.place),
        activities: ["Morning – add plan", "Afternoon – add plan", "Evening – add plan"],
      });
      next.days = next.itinerary.length;
      return next;
    });
  };

  const removeLastDay = () => {
    setPlan((prev) => {
      if (prev.itinerary.length <= 1) return prev;
      const next = structuredClone(prev);
      next.itinerary.pop();
      next.days = next.itinerary.length;
      return next;
    });
  };

  const printItinerary = () => window.print();

  return (
    <div className="App">
      {/* Hero */}
      <div className="hero" style={{ backgroundImage: `url(${hero})` }}>
        <div className="overlay">
          <h1>🌍 AI Travel Planner</h1>
          <p>Create a beautiful, editable itinerary with a smart INR budget.</p>
        </div>
      </div>

      {/* Controls */}
      <section className="controls container">
        <div className="field">
          <label>Destination</label>
          <input
            type="text"
            placeholder="e.g. Paris, Goa, Tokyo"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
          />
        </div>

        <div className="field">
          <label>Days</label>
          <input
            type="number"
            min="1"
            max="30"
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value || "1", 10))}
          />
        </div>

        <div className="field">
          <label>Travel Style</label>
          <select value={style} onChange={(e) => setStyle(e.target.value)}>
            <option value="budget">Budget</option>
            <option value="comfort">Comfort</option>
            <option value="luxury">Luxury</option>
          </select>
        </div>

        <button className="primary" onClick={generatePlan}>✨ Generate Plan</button>
      </section>

      {/* Budget */}
      {plan && (
        <section className="budget container print-card">
          <h2>💰 Budget (INR)</h2>
          <div className="budget-grid">
            {Object.entries(plan.budget)
              .filter(([k]) => k !== "total")
              .map(([k, v]) => (
                <div className="budget-item" key={k}>
                  <div className="cap">{k.replace(/([A-Z])/g, " $1")}</div>
                  <div className="val">₹{v.toLocaleString("en-IN")}</div>
                </div>
              ))}
            <div className="budget-item total">
              <div className="cap">Total</div>
              <div className="val">₹{plan.budget.total.toLocaleString("en-IN")}</div>
            </div>
          </div>
          <p className="note">
            Includes flights, accommodation, food, local transport, activities & a 10% buffer. 
            {isDomestic(plan.place) ? " (Domestic estimate)" : " (International estimate)"}.
          </p>
          <div className="actions">
            <button onClick={addDay}>➕ Add Day</button>
            <button onClick={removeLastDay}>➖ Remove Last Day</button>
            <button className="outline" onClick={printItinerary}>🖨️ Print / Save as PDF</button>
          </div>
        </section>
      )}

      {/* Itinerary */}
      {plan && (
        <section className="itinerary container">
          <h2>🗓️ Your Itinerary for {plan.place} ({plan.days} days)</h2>
          <div className="cards">
            {plan.itinerary.map((d, dIndex) => (
              <article className="card print-card" key={dIndex}>
                <div className="card-photo" style={{ backgroundImage: `url(${d.photo})` }}>
                  <div className="badge">Day {d.day}</div>
                </div>
                <div className="card-body">
                  <h3>📍 {d.location}</h3>
                  <ul className="activity-list">
                    {d.activities.map((a, aIndex) => (
                      <li className="activity" key={aIndex}>
                        <input
                          className="activity-input"
                          value={a}
                          onChange={(e) => updateActivity(dIndex, aIndex, e.target.value)}
                        />
                        <button
                          className="remove"
                          title="Remove activity"
                          onClick={() => removeActivity(dIndex, aIndex)}
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                  <button className="add-activity" onClick={() => addActivity(dIndex)}>
                    ➕ Add activity
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <span>✨ Built with React • INR-ready • Photo-rich • Fully editable</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
