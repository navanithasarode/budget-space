
import React, { useState } from "react";
import { api } from "../services/api";
import Stay from "./Stay";
import "./TravelPlanner.css";

export default function TravelPlanner() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [mode, setMode] = useState("all");

  // Shared stay preferences
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxPrice, setMaxPrice] = useState(2000);
  const [stayType, setStayType] = useState("all");
  const [distanceTarget, setDistanceTarget] = useState("cityCentre");
  const [landmark, setLandmark] = useState("");

  // Search results
  const [trip, setTrip] = useState(null);
  const [options, setOptions] = useState([]);
  const [stays, setStays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Food filters
  const [cuisine, setCuisine] = useState("all");
  const [foodBudget, setFoodBudget] = useState("any");

  async function handleSearch(event) {
    event.preventDefault();
    setError("");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (new Date(`${date}T00:00:00`) < today) {
      setError("Travel date cannot be in the past.");
      return;
    }

    if (new Date(`${checkIn}T00:00:00`) < today) {
      setError("Check-in date cannot be in the past.");
      return;
    }

    if (new Date(`${checkOut}T00:00:00`) <= new Date(`${checkIn}T00:00:00`)) {
      setError("Check-out date must be after check-in date.");
      return;
    }

    if (distanceTarget === "landmark" && !landmark.trim()) {
      setError("Please enter a landmark or attraction.");
      return;
    }

    setLoading(true);
    setTrip(null);
    setOptions([]);
    setStays([]);

    try {
      const [transportData, stayData] = await Promise.all([
        api.searchTransport({
          from,
          to,
          date,
          passengers: String(passengers),
          mode,
        }),

        api.searchStays({
          destination: to,
          checkIn,
          checkOut,
          guests: String(passengers),
          maxPrice: String(maxPrice),
          type: stayType,
          distanceTarget,
          ...(distanceTarget === "landmark"
            ? { landmark: landmark.trim() }
            : {}),
        }),
      ]);

      setTrip(transportData.trip);
      setOptions(transportData.options || []);
      setStays(stayData.stays || []);
    } catch (err) {
      setError(err.message || "Unable to search. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="travel-page">
      <header className="travel-hero">
        <div className="travel-hero-content">
          <p className="travel-eyebrow">YOUR NEXT ADVENTURE STARTS HERE</p>
          <h1>Plan less. Explore more.</h1>
          <p>
            Find transport, discover a stay, and organise your trip
            around your budget — all in one place.
          </p>
        </div>
        <div className="travel-hero-icon" aria-hidden="true">
          ✈️
        </div>
      </header>

      <section className="travel-section">
        <div className="travel-section-heading">
          <span className="travel-step">01</span>
          <div>
            <h2>Plan your trip</h2>
            <p>Enter your journey and preferences once.</p>
          </div>
        </div>

        <form className="travel-form" onSubmit={handleSearch}>
          <div className="travel-form-grid">
            <label>
              Starting point
              <input
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="e.g. Bengaluru"
                required
              />
            </label>

            <label>
              Destination
              <input
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="e.g. Mysuru"
                required
              />
            </label>

            <label>
              Travel date
              <input
                type="date"
                value={date}
                min={new Date().toLocaleDateString("en-CA")}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </label>

            <label>
              Travellers
              <select
                value={passengers}
                onChange={(e) => setPassengers(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "traveller" : "travellers"}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Transport preference
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
              >
                <option value="all">All transport modes</option>
                <option value="train">Train</option>
                <option value="bus">Bus</option>
                <option value="flight">Flight</option>
              </select>
            </label>
          </div>

          <div className="travel-form-divider" />

          <div className="travel-subheading">
            <span>🏨</span>
            <div>
              <h3>Stay preferences</h3>
              <p>Choose dates and a nightly budget for your accommodation.</p>
            </div>
          </div>

          <div className="travel-form-grid">
            <label>
              Check-in
              <input
                type="date"
                value={checkIn}
                min={date || new Date().toLocaleDateString("en-CA")}
                onChange={(e) => setCheckIn(e.target.value)}
                required
              />
            </label>

            <label>
              Check-out
              <input
                type="date"
                value={checkOut}
                min={checkIn || date || new Date().toLocaleDateString("en-CA")}
                onChange={(e) => setCheckOut(e.target.value)}
                required
              />
            </label>

            <label>
              Maximum budget per night
              <select
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
              >
                <option value={500}>Up to ₹500</option>
                <option value={1000}>Up to ₹1,000</option>
                <option value={2000}>Up to ₹2,000</option>
                <option value={3000}>Up to ₹3,000</option>
                <option value={5000}>Up to ₹5,000</option>
                <option value={10000}>Up to ₹10,000</option>
              </select>
            </label>

            <label>
              Accommodation type
              <select
                value={stayType}
                onChange={(e) => setStayType(e.target.value)}
              >
                <option value="all">All types</option>
                <option value="hotel">Hotel</option>
                <option value="hostel">Hostel</option>
                <option value="homestay">Homestay</option>
                <option value="guesthouse">Guesthouse</option>
              </select>
            </label>

            <label>
              Measure distance from
              <select
                value={distanceTarget}
                onChange={(e) => setDistanceTarget(e.target.value)}
              >
                <option value="cityCentre">City centre</option>
                <option value="landmark">Landmark or attraction</option>
              </select>
            </label>

            {distanceTarget === "landmark" && (
              <label>
                Landmark or attraction
                <input
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Mysore Palace"
                  required
                />
              </label>
            )}
          </div>

          {error && (
            <p className="travel-error" role="alert">
              {error}
            </p>
          )}

          <button
            className="travel-primary-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Finding your options..." : "Find my trip options"}
            {!loading && <span aria-hidden="true"> →</span>}
          </button>

          <p className="travel-form-footnote">
            Transport and stay searches use the same trip details.
          </p>
        </form>
      </section>

      {trip && (
        <>
          <section className="travel-section" id="transport">
            <div className="travel-section-heading">
              <span className="travel-step">02</span>
              <div>
                <h2>Getting there</h2>
                <p>
                  {trip.from} <span aria-hidden="true">→</span> {trip.to}
                  {" · "}{trip.date}
                </p>
              </div>
            </div>

            <p className="travel-info-note">
              These are booking links, not live fare or availability
              results. Confirm details with the booking provider.
            </p>

            {options.length === 0 ? (
              <div className="travel-empty">
                No transport options are available for this search.
              </div>
            ) : (
              <div className="transport-results">
                {options.map((option) => (
                  <article className="transport-card" key={option.mode}>
                    <div className="transport-card-icon">
                      {option.mode === "train"
                        ? "🚆"
                        : option.mode === "bus"
                        ? "🚌"
                        : "✈️"}
                    </div>

                    <div className="transport-card-content">
                      <h3>
                        {option.mode === "train"
                          ? "Train"
                          : option.mode === "bus"
                          ? "Bus"
                          : "Flight"}
                      </h3>
                      <p>{option.provider}</p>
                      <span className="transport-status">
                        {option.fareStatus}
                      </span>
                    </div>

                    <a
                      className="transport-link"
                      href={option.bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View options ↗
                    </a>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="travel-section" id="stays">
            <div className="travel-section-heading">
              <span className="travel-step">03</span>
              <div>
                <h2>Stay somewhere you love</h2>
                <p>Recommendations based on your budget and preferences.</p>
              </div>
            </div>

            <Stay
              stays={stays}
              destination={to}
              checkIn={checkIn}
              checkOut={checkOut}
              guests={passengers}
            />
          </section>

          <section className="travel-section" id="food">
            <div className="travel-section-heading">
              <span className="travel-step">04</span>
              <div>
                <h2>Good food, close by</h2>
                <p>Explore restaurants and cafés at your destination.</p>
              </div>
            </div>

            <div className="food-filter-panel">
              <label>
                Cuisine
                <select
                  value={cuisine}
                  onChange={(e) => setCuisine(e.target.value)}
                >
                  <option value="all">All cuisines</option>
                  <option value="south-indian">South Indian</option>
                  <option value="north-indian">North Indian</option>
                  <option value="chinese">Chinese</option>
                  <option value="italian">Italian</option>
                  <option value="cafe">Cafés and coffee</option>
                  <option value="fast-food">Fast food</option>
                </select>
              </label>

              <label>
                Budget per person
                <select
                  value={foodBudget}
                  onChange={(e) => setFoodBudget(e.target.value)}
                >
                  <option value="any">Any budget</option>
                  <option value="under200">Under ₹200</option>
                  <option value="200-500">₹200–₹500</option>
                  <option value="500plus">₹500 and above</option>
                </select>
              </label>
            </div>

            <div className="food-coming-soon">
              <span className="food-coming-soon-icon">🍜</span>
              <div>
                <h3>Discover food in {to}</h3>
                <p>
                  Your cuisine preference is{" "}
                  <strong>
                    {cuisine === "all"
                      ? "all cuisines"
                      : cuisine.replace("-", " ")}
                  </strong>
                  {" "}and your budget is{" "}
                  <strong>
                    {foodBudget === "any"
                      ? "any price range"
                      : foodBudget === "under200"
                      ? "under ₹200 per person"
                      : foodBudget === "200-500"
                      ? "₹200–₹500 per person"
                      : "₹500 or more per person"}
                  </strong>.
                </p>
                <p className="travel-muted">
                  Restaurant listings are not connected yet. These filters
                  currently save your choices on this page; they do not
                  retrieve restaurant results.
                </p>
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
