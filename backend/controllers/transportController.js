const VALID_MODES = ["train", "bus", "flight"];

function searchTransport(req, res) {
  try {
    const {
      from,
      to,
      date,
      passengers = "1",
      mode = "all"
    } = req.query;

    if (!from || !to || !date) {
      return res.status(400).json({
        message: "Origin, destination and travel date are required."
      });
    }

    if (from.trim().toLowerCase() === to.trim().toLowerCase()) {
      return res.status(400).json({
        message: "Origin and destination must be different."
      });
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        message: "Date must use YYYY-MM-DD format."
      });
    }

    const count = Number(passengers);

    if (!Number.isInteger(count) || count < 1 || count > 20) {
      return res.status(400).json({
        message: "Passengers must be between 1 and 20."
      });
    }

    const selectedModes =
      mode === "all" ? VALID_MODES : [mode];

    if (!selectedModes.every(m => VALID_MODES.includes(m))) {
      return res.status(400).json({
        message: "Mode must be train, bus, flight or all."
      });
    }

    const origin = from.trim();
    const destination = to.trim();

    const options = [];

    if (selectedModes.includes("train")) {
      options.push({
        mode: "train",
        provider: "IRCTC",
        fare: null,
        fareStatus: "Check current fare on booking website",
        bookingUrl: "https://www.irctc.co.in/"
      });
    }

    if (selectedModes.includes("bus")) {
      const query = new URLSearchParams({
        fromCity: origin,
        toCity: destination,
        on: date
      });

      options.push({
        mode: "bus",
        provider: "RedBus",
        fare: null,
        fareStatus: "Check current fare on booking website",
        bookingUrl:
          `https://www.redbus.in/` +
          `?${query.toString()}`
      });
    }

    if (selectedModes.includes("flight")) {
      const query = new URLSearchParams({
        q: `flights from ${origin} to ${destination} on ${date}`
      });

      options.push({
        mode: "flight",
        provider: "Google Flights search",
        fare: null,
        fareStatus: "Check current fare on booking website",
        bookingUrl:
          `https://www.google.com/travel/flights?${query.toString()}`
      });
    }

    return res.json({
      success: true,
      currency: "INR",
      trip: {
        from: origin,
        to: destination,
        date,
        passengers: count
      },
      options,
      note:
        "Live fares are not available for every transport mode yet. " +
        "No estimated price is presented as a confirmed fare."
    });
  } catch (error) {
    console.error("Transport search error:", error);

    return res.status(500).json({
      message: "Could not search transport options."
    });
  }
}

async function getTrainFare(req, res) {
  const {
    trainNumber,
    fromCode,
    toCode,
    date,
    travelClass = "SL"
  } = req.query;

  if (
    !trainNumber ||
    !fromCode ||
    !toCode ||
    !date
  ) {
    return res.status(400).json({
      message:
        "Train number, station codes and travel date are required."
    });
  }

  if (!/^\d{5}$/.test(trainNumber)) {
    return res.status(400).json({
      message: "Train number must contain 5 digits."
    });
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({
      message: "Date must use YYYY-MM-DD format."
    });
  }

  const apiKey = process.env.RAILRADAR_API_KEY;

  if (!apiKey) {
    return res.status(503).json({
      message:
        "Live train fare lookup is not configured yet.",
      nextStep:
        "Add RAILRADAR_API_KEY to the backend .env file."
    });
  }

  try {
    const params = new URLSearchParams({
      source: fromCode.trim().toUpperCase(),
      destination: toCode.trim().toUpperCase(),
      journeyDate: date,
      classCode: travelClass
    });

    const response = await fetch(
      `https://api.railradar.in/v1/trains/` +
      `${encodeURIComponent(trainNumber)}/fare?${params}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`
        },
        signal: AbortSignal.timeout(10000)
      }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return res.status(response.status === 401 ? 502 : 503).json({
        message: "The train fare provider could not return a fare.",
        providerStatus: response.status
      });
    }

    return res.json({
      success: true,
      currency: "INR",
      source: "RailRadar",
      data
    });
  } catch (error) {
    console.error("Train fare provider error:", error);

    return res.status(502).json({
      message: "Could not retrieve the train fare right now."
    });
  }
}


function searchTrains(req, res) {
  const { from, to, date } = req.query;

  if (!from || !to || !date) {
    return res.status(400).json({
      success: false,
      message: "Origin, destination and travel date are required."
    });
  }

  if (from.trim().toLowerCase() === to.trim().toLowerCase()) {
    return res.status(400).json({
      success: false,
      message: "Origin and destination must be different."
    });
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({
      success: false,
      message: "Date must use YYYY-MM-DD format."
    });
  }

  return res.json({
    success: true,
    source: "Budget Space demo",
    isLiveData: false,
    currency: "INR",
    trip: {
      from: from.trim(),
      to: to.trim(),
      date
    },
    trains: [],
    message:
      "Live train results are not connected yet. " +
      "Use the transport search results to visit the official booking website."
  });
}



module.exports = {
  searchTransport,
  getTrainFare,
  searchTrains
};
