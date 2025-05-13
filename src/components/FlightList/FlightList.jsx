import {
  Clock,
  Calendar,
  Plane,
  CreditCard,
  ArrowRightLeft,
  TicketsPlane,
  CircleAlert,
  CircleCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import styles from "./FlightList.module.css";
import BookingModal from "../BookingModal/BookingModal";
import { formatDate, formatTime, getDuration } from "../../utils/formatters";
import {
  fetchAirports,
  searchFlights,
  getAvailableSeats,
} from "../../utils/api";

export default function FlightList() {
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [fromAirport, setFromAirport] = useState("");
  const [toAirport, setToAirport] = useState("");
  const [departureDate, setDepartureDate] = useState("");

  const [airportOptions, setAirportOptions] = useState([]);
  const [flights, setFlights] = useState([]);

  //airports for dropdown
  useEffect(() => {
    async function loadAirports() {
      try {
        const data = await fetchAirports();
        setAirportOptions(data);
      } catch (err) {
        console.error("Error fetching airports:", err);
      }
    }

    loadAirports();
  }, []);

  async function loadFlights() {
    try {
      const params = {};
      if (fromAirport) params.departureId = fromAirport;
      if (toAirport) params.arrivalId = toAirport;
      if (departureDate) params.date = departureDate;

      const data = await searchFlights(params);

      // Get available seats for each flight
      const flightsWithAvailability = await Promise.all(
        data.map(async (flight) => {
          const seatData = await getAvailableSeats(flight.FLIGHTID);
          return {
            ...flight,
            available: seatData.availableSeats > 0,
          };
        })
      );

      setFlights(flightsWithAvailability);
    } catch (err) {
      console.error("Error fetching flights:", err);
    }
  }

  //flight search every time search states change
  useEffect(() => {
    loadFlights();
  }, [fromAirport, toAirport, departureDate]);

  const handleBookClick = (flight) => {
    setSelectedFlight(flight);
    setShowModal(true);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Available Flights</h2>

      <div className={styles.filters}>
        <div className={styles.dropdown}>
          <select
            value={fromAirport}
            onChange={(e) => setFromAirport(e.target.value)}
          >
            <option value="">From Airport</option>
            {airportOptions.map((airport) => (
              <option key={airport.id} value={airport.id}>
                {airport.label}
              </option>
            ))}
          </select>
        </div>

        <ArrowRightLeft className={styles.swapIcon} />

        <div className={styles.dropdown}>
          <select
            disabled={!fromAirport}
            value={toAirport}
            onChange={(e) => setToAirport(e.target.value)}
          >
            <option value="">To Airport</option>
            {airportOptions.map((airport) => (
              <option key={airport.id} value={airport.id}>
                {airport.label}
              </option>
            ))}
          </select>
        </div>

        <input
          disabled={!fromAirport}
          type="date"
          value={departureDate}
          onChange={(e) => setDepartureDate(e.target.value)}
          className={styles.dateInput}
        />
      </div>
      {flights.length ? (
        <div className={styles.list}>
          {flights.map((flight) => (
            <div key={flight.FLIGHTID} className={styles.card}>
              <div className={styles.header}>
                <div className={styles.airline}>
                  <TicketsPlane className={styles.airlineIcon} />
                  <div>
                    <div className={styles.airlineName}>
                      {flight.DEPARTURECITY} - {flight.ARRIVALCITY}
                    </div>
                    <div className={styles.flightNumber}>
                      Flight {flight.FLIGHTNUMBER}
                    </div>
                  </div>
                </div>
                <div className={styles.price}>${flight.PRICE}</div>
              </div>

              <div className={styles.route}>
                <div className={styles.endpoint}>
                  <div className={styles.time}>
                    {formatTime(flight.DEPARTUREDATETIME)}
                  </div>
                  <div className={styles.airport}>
                    {flight.DEPARTUREAIRPORT}
                  </div>
                </div>

                <div className={styles.path}>
                  <div className={styles.pathLine}>
                    <div className={styles.pathDot}></div>
                    <div className={styles.pathDot}></div>
                  </div>
                  <div className={styles.pathLabel}>
                    {getDuration(
                      flight.DEPARTUREDATETIME,
                      flight.ARRIVALDATETIME
                    )}
                  </div>
                </div>

                <div className={styles.endpoint}>
                  <div className={styles.time}>
                    {formatTime(flight.ARRIVALDATETIME)}
                  </div>
                  <div className={styles.airport}>{flight.ARRIVALAIRPORT}</div>
                </div>
              </div>

              <div className={styles.footer}>
                <div className={styles.details}>
                  <div className={styles.detail}>
                    <Calendar size={16} />
                    <span>{formatDate(flight.DEPARTUREDATETIME)}</span>
                  </div>
                  <div className={styles.detail}>
                    <Clock size={16} />
                    <span>
                      {getDuration(
                        flight.DEPARTUREDATETIME,
                        flight.ARRIVALDATETIME
                      )}
                    </span>
                  </div>
                  {flight.available ? (
                    <div className={styles.detail}>
                      <CircleCheck size={16} className={styles.availableIcon} />
                      <span>Available</span>
                    </div>
                  ) : (
                    <div className={styles.detail}>
                      <CircleAlert
                        size={16}
                        className={styles.unavailableIcon}
                      />
                      <span>Not Available</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleBookClick(flight)}
                  className={styles.bookButton}
                  disabled={!flight.available}
                >
                  <CreditCard size={16} />
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.notFound}>No Flights Found...</div>
      )}

      {showModal && (
        <BookingModal
          refreshFlights={loadFlights}
          flight={selectedFlight}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
