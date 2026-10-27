
const sampleStays = [
  {
    id: "stay-1",
    name: "Budget Comfort Stay",
    city: "Bengaluru",
    type: "Hotel",
    pricePerNight: 1200,
    demoRating: 4.3,
    demoReviewCount: 180,
    cityCentreDistanceKm: 2.0,
    landmarkDistanceKm: 1.2,
    amenities: ["Wi-Fi", "Parking"],
    isDemo: true
  },
  {
    id: "stay-2",
    name: "City Backpacker Hostel",
    city: "Bengaluru",
    type: "Hostel",
    pricePerNight: 600,
    demoRating: 4.6,
    demoReviewCount: 95,
    cityCentreDistanceKm: 4.0,
    landmarkDistanceKm: 3.0,
    amenities: ["Wi-Fi", "Shared lounge"],
    isDemo: true
  },
  {
    id: "stay-3",
    name: "Simple Homestay",
    city: "Bengaluru",
    type: "Homestay",
    pricePerNight: 1800,
    demoRating: 4.5,
    demoReviewCount: 140,
    cityCentreDistanceKm: 1.0,
    landmarkDistanceKm: 0.8,
    amenities: ["Wi-Fi", "Kitchen"],
    isDemo: true
  }
];

function searchStays(req, res) {
  const {
    destination,
    checkIn,
    checkOut,
    guests = "1",
    maxPrice = "2000",
    type = "all",
    distanceTarget = "cityCentre",
    landmark = ""
  } = req.query;

  if (!destination || !checkIn || !checkOut) {
    return res.status(400).json({
      success: false,
      message: "Destination, check-in and check-out dates are required."
    });
  }

  const validDate = (value) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

    const parsed = new Date(`${value}T00:00:00Z`);

    return (
      !Number.isNaN(parsed.getTime()) &&
      parsed.toISOString().slice(0, 10) === value
    );
  };

  if (!validDate(checkIn) || !validDate(checkOut)) {
    return res.status(400).json({
      success: false,
      message: "Please provide valid dates in YYYY-MM-DD format."
    });
  }

  const start = new Date(`${checkIn}T00:00:00Z`);
  const end = new Date(`${checkOut}T00:00:00Z`);

  if (end <= start) {
    return res.status(400).json({
      success: false,
      message: "Check-out must be after check-in."
    });
  }

  const guestCount = Number(guests);
  const budget = Number(maxPrice);

  if (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 20) {
    return res.status(400).json({
      success: false,
      message: "Guests must be between 1 and 20."
    });
  }

  if (!Number.isFinite(budget) || budget <= 0) {
    return res.status(400).json({
      success: false,
      message: "Maximum price must be greater than zero."
    });
  }

  const allowedTypes = [
    "all",
    "hotel",
    "hostel",
    "homestay",
    "guesthouse"
  ];

  if (!allowedTypes.includes(type.toLowerCase())) {
    return res.status(400).json({
      success: false,
      message: "Please choose a valid accommodation type."
    });
  }

  if (!["cityCentre", "landmark"].includes(distanceTarget)) {
    return res.status(400).json({
      success: false,
      message: "Distance target must be cityCentre or landmark."
    });
  }

  if (distanceTarget === "landmark" && !landmark.trim()) {
    return res.status(400).json({
      success: false,
      message: "Please enter a landmark."
    });
  }

  const nights = Math.round((end - start) / 86400000);

  const results = sampleStays
    .filter(stay =>
      stay.city.toLowerCase() === destination.trim().toLowerCase()
    )
    .filter(stay =>
      type.toLowerCase() === "all" ||
      stay.type.toLowerCase() === type.toLowerCase()
    )
    .filter(stay => stay.pricePerNight <= budget)
    .map(stay => {
      const distanceKm =
        distanceTarget === "landmark"
          ? stay.landmarkDistanceKm
          : stay.cityCentreDistanceKm;

      // Transparent weighted score:
      // Reviews: 40 points, distance: 30, budget: 30.
      const reviewScore = (stay.demoRating / 5) * 40;

      const distanceScore =
        Math.max(0, 1 - distanceKm / 20) * 30;

      const budgetScore =
        (1 - stay.pricePerNight / budget) * 30;

      const recommendationScore = Number(
        (reviewScore + distanceScore + budgetScore).toFixed(2)
      );

      return {
        ...stay,
        rating: stay.demoRating,
        reviewCount: stay.demoReviewCount,
        distanceKm,
        distanceFrom:
          distanceTarget === "landmark"
            ? landmark.trim()
            : `${destination.trim()} city centre`,
        nights,
        guests: guestCount,
        estimatedTotal: stay.pricePerNight * nights,
        currency: "INR",
        recommendationScore,
        rankingBreakdown: {
          reviews: Number(reviewScore.toFixed(2)),
          distance: Number(distanceScore.toFixed(2)),
          budget: Number(budgetScore.toFixed(2))
        }
      };
    })
    .sort((a, b) =>
      b.recommendationScore - a.recommendationScore
    )
    .slice(0, 3)
    .map((stay, index) => ({
      ...stay,
      recommendationRank: index + 1,
      recommendationLabel:
        index === 0
          ? "Top recommendation"
          : index === 1
          ? "Alternative option"
          : "Third option"
    }));

  return res.json({
    success: true,
    source: "Budget Space demo data",
    isLiveData: false,
    rankingWeights: {
      reviews: 40,
      distance: 30,
      budget: 30
    },
    destination: destination.trim(),
    checkIn,
    checkOut,
    guests: guestCount,
    maxPricePerNight: budget,
    distanceTarget,
    landmark: distanceTarget === "landmark" ? landmark.trim() : null,
    nights,
    count: results.length,
    stays: results,
    note:
      "All listings, ratings, review counts and distances are fictional demo data. " +
      "Scores demonstrate the ranking algorithm and are not real recommendations."
  });
}

module.exports = { searchStays };
