
import { useState } from "react";
import { api } from "../services/api";
import "./Stay.css";

export default function Stay() {
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [type, setType] = useState("all");
  const [distanceTarget, setDistanceTarget] = useState("cityCentre");
  const [landmark, setLandmark] = useState("");

  const [stays, setStays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  
async function handleSearch(event) {
  event.preventDefault();
  setLoading(true);
  setError("");
  setStays([]);
  setSearched(false);

  try {
    const data = await api.searchStays({
      destination,
      checkIn,
      checkOut,
      guests: String(guests),
      maxPrice: String(maxPrice),
      type,
      distanceTarget,
      ...(distanceTarget === "landmark" ? { landmark } : {})
    });

    setStays(data.stays || []);
    setSearched(true);
  } catch (err) {
    setError(err.message || "Unable to search stays. Please try again.");
  } finally {
    setLoading(false);
  }
}


  return (
    <main className="stay-page">
      <section className="stay-hero">
        <p className="stay-eyebrow">FIND YOUR PLACE</p>
        <h1>Stay somewhere you love.</h1>
        <p className="stay-subtitle">
          Find a comfortable place to stay without exceeding your budget.
        </p>
      </section>

      <form className="stay-search-form" onSubmit={handleSearch}>
        <label>
          Destination
          <input
            type="text"
            placeholder="e.g. Bengaluru"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
          />
        </label>

        <div className="stay-date-grid">
          <label>
            Check-in
            <input
              type="date"
              value={checkIn}
              min={new Date().toLocaleDateString("en-CA")}
              onChange={(e) => setCheckIn(e.target.value)}
              required
            />
          </label>

          <label>
            Check-out
            <input
              type="date"
              value={checkOut}
              min={checkIn || new Date().toLocaleDateString("en-CA")}
              onChange={(e) => setCheckOut(e.target.value)}
              required
            />
          </label>
        </div>

        <div className="stay-filter-grid">
          <label>
            Guests
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "guest" : "guests"}
                </option>
              ))}
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
                    type="text"
                    placeholder="e.g. Lalbagh Botanical Garden"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    required
                />
            </label>
        )}

          <label>
            Accommodation
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="all">All types</option>
              <option value="hotel">Hotel</option>
              <option value="hostel">Hostel</option>
              <option value="homestay">Homestay</option>
              <option value="guesthouse">Guesthouse</option>
            </select>
          </label>

          <label>
            Budget per night
            <select
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            >
              <option value={500}>Up to ₹500</option>
              <option value={1000}>Up to ₹1,000</option>
              <option value={2000}>Up to ₹2,000</option>
              <option value={3000}>Up to ₹3,000</option>
              <option value={5000}>Up to ₹5,000</option>
              <option value={10000}>Any listed price up to ₹10,000</option>
            </select>
          </label>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search stays"}
        </button>
      </form>

      {error && <p className="stay-error">{error}</p>}

      {searched && (
        <section className="stay-results">
          <div className="stay-results-heading">
            <div>
              <p className="stay-eyebrow">YOUR OPTIONS</p>
              <h2>Places to stay in {destination}</h2>
            </div>
            <span>{stays.length} results</span>
          </div>

          <p className="stay-demo-note">
            Demo listings and prices only. Availability, reviews and prices
            have not been verified.
          </p>

          {stays.length === 0 ? (
            <p className="stay-empty">
              No demo listings match this search. Try Bengaluru or increase
              your budget.
            </p>
          ) : (
            <div className="stay-results-grid">
              {stays.map((stay) => (
                <article className="stay-card" key={stay.id}>
                  <div className="stay-card-icon">
                    {stay.type === "Hostel"
                      ? "🛏️"
                      : stay.type === "Homestay"
                      ? "🏡"
                      : "🏨"}
                  </div>

                  <div className="stay-card-body">
                    <span className="stay-type">{stay.type}</span>
                    <h3>{stay.name}</h3>
                    <p className="stay-location">{stay.city}</p>

                    <div className="stay-amenities">
                      {stay.amenities.map((amenity) => (
                        <span key={amenity}>{amenity}</span>
                      ))}
                    </div>

                    <div className="stay-recommendation">
                        <div className="stay-recommendation-heading">
                            <strong>
                                {stay.recommendationRank === 1
                                ? "★ Top recommendation"
                                : `#${stay.recommendationRank} · ${stay.recommendationLabel}`}
                            </strong>
                            <span>{stay.recommendationScore}/100</span>
                        </div>
                        
                        <div className="stay-score-track">
                            <div
                                className="stay-score-fill"
                                style={{ width: `${stay.recommendationScore}%` }}
                            />
                        </div>
                        
                        <div className="stay-score-breakdown">
                            <span>Reviews: {stay.rankingBreakdown.reviews}/40</span>
                            <span>Distance: {stay.rankingBreakdown.distance}/30</span>
                            <span>Budget: {stay.rankingBreakdown.budget}/30</span>
                        </div>
                        
                        <p className="stay-distance">
                            {stay.distanceKm} km from {stay.distanceFrom}
                        </p>
                    </div>


                    <div className="stay-price">
                      <div>
                        <strong>
                          ₹{stay.pricePerNight.toLocaleString("en-IN")}
                        </strong>
                        <span> / night</span>
                      </div>

                      <p>
                        Estimated total: ₹
                        {stay.estimatedTotal.toLocaleString("en-IN")}
                      </p>
                      <small>
                        {stay.nights} nights · {guests} guests requested
                      </small>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
}
