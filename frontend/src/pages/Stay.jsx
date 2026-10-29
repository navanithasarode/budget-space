
export default function Stay({
  stays = [],
  destination = "",
  checkIn = "",
  checkOut = "",
  guests = 1,
}) {
  const hasResults = stays.length > 0;

  return (
    <section className="stay-results">
      <div className="stay-results-heading">
        <div>
          <p className="travel-eyebrow">YOUR OPTIONS</p>
          <h2>Places to stay in {destination}</h2>
          <p className="travel-muted">
            {checkIn} to {checkOut} · {guests}{" "}
            {guests === 1 ? "guest" : "guests"}
          </p>
        </div>

        <span className="stay-result-count">
          {stays.length} {stays.length === 1 ? "result" : "results"}
        </span>
      </div>

      <p className="stay-demo-note">
        Demo listings and prices only. Availability, reviews and prices
        have not been verified.
      </p>

      {!hasResults ? (
        <div className="travel-empty">
          <span className="travel-empty-icon">🏨</span>
          <h3>No matching stays found</h3>
          <p>
            Try Bengaluru, choose a different accommodation type, or
            increase your nightly budget.
          </p>
        </div>
      ) : (
        <div className="stay-results-grid">
          {stays.slice(0, 3).map((stay) => (
            <article className="stay-card" key={stay.id}>
              <div className="stay-card-icon">
                {stay.type === "Hostel"
                  ? "🛏️"
                  : stay.type === "Homestay"
                  ? "🏡"
                  : stay.type === "Guesthouse"
                  ? "🏠"
                  : "🏨"}
              </div>

              <div className="stay-card-body">
                <span className="stay-type">{stay.type}</span>
                <h3>{stay.name}</h3>
                <p className="stay-location">{stay.city}</p>

                <div className="stay-amenities">
                  {(stay.amenities || []).map((amenity) => (
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

                    <span>
                      {stay.recommendationScore}/100
                    </span>
                  </div>

                  <div className="stay-score-track">
                    <div
                      className="stay-score-fill"
                      style={{
                        width: `${stay.recommendationScore}%`,
                      }}
                    />
                  </div>

                  <div className="stay-score-breakdown">
                    <span>
                      Reviews: {stay.rankingBreakdown?.reviews ?? 0}/40
                    </span>
                    <span>
                      Distance: {stay.rankingBreakdown?.distance ?? 0}/30
                    </span>
                    <span>
                      Budget: {stay.rankingBreakdown?.budget ?? 0}/30
                    </span>
                  </div>

                  <p className="stay-distance">
                    {stay.distanceKm} km from {stay.distanceFrom}
                  </p>
                </div>

                <div className="stay-price">
                  <div>
                    <strong>
                      ₹{Number(stay.pricePerNight).toLocaleString("en-IN")}
                    </strong>
                    <span> / night</span>
                  </div>

                  <p>
                    Estimated total: ₹
                    {Number(stay.estimatedTotal).toLocaleString("en-IN")}
                  </p>

                  <small>
                    {stay.nights} nights · {guests}{" "}
                    {guests === 1 ? "guest" : "guests"} requested
                  </small>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
