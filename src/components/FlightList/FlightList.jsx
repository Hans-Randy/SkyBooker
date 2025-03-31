import { Clock, Calendar, Plane, CreditCard, ArrowRightLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import styles from './FlightList.module.css'
import BookingModal from '../BookingModal/BookingModal'

export default function FlightList() {
  const [selectedFlight, setSelectedFlight] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const [fromAirport, setFromAirport] = useState('')
  const [toAirport, setToAirport] = useState('')
  const [departureDate, setDepartureDate] = useState('')

  const [airportOptions, setAirportOptions] = useState([])

  const [flights, setFlights] = useState([]);

  //airports for dropdown
  useEffect(() => {
    async function fetchAirports() {
      try {
        const res = await fetch('/api/airports')
        const data = await res.json()
        setAirportOptions(data)
      } catch (err) {
        console.error('Error fetching airports:', err)
      }
    }

    fetchAirports()
  }, [])


  //flight search every time search states change
  useEffect(() => {
    async function fetchFlights() {
      try {
        let res;

        if(fromAirport) {
          const params = new URLSearchParams({departureId: fromAirport});
          if (toAirport) params.append('arrivalId', toAirport);
          if (departureDate) params.append('date', departureDate);
          res = await fetch(`/api/search-flights?${params}`);
        }
        else res = await fetch(`/api/search-flights`);
        
        const data = await res.json();
        setFlights(data);
      } catch (err) {
        console.error('Error fetching flights:', err);
      }
    }
  
    fetchFlights();
  }, [fromAirport, toAirport, departureDate]);
  function formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      timeZone: 'UTC',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }); // e.g., "Mar 18, 2025"
  }
  
  function formatTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      timeZone: 'UTC',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }); // e.g., "05:00 PM"
  }
  
  function getDuration(startIso, endIso) {
    const start = new Date(startIso);
    const end = new Date(endIso);
  
    const diffMs = end - start;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
    return `${hours}h ${minutes}m`; // e.g., "4h 0m"
  }
  const handleBookClick = (flight) => {
    setSelectedFlight(flight)
    setShowModal(true)
  }

  

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Available Flights</h2>

      <div className={styles.filters}>
        <div className={styles.dropdown}>
          <select value={fromAirport} onChange={e => setFromAirport(e.target.value)}>
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
          <select disabled={!fromAirport} value={toAirport} onChange={e => setToAirport(e.target.value)}>
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
          onChange={e => setDepartureDate(e.target.value)}
          className={styles.dateInput}
        />
      </div>

      <div className={styles.list}>
        {flights.map((flight) => (
          <div key={flight.FLIGHTID} className={styles.card}>
            <div className={styles.header}>
              <div className={styles.airline}>
                <Plane className={styles.airlineIcon} />
                <div>
                  <div className={styles.airlineName}>{flight.DEPARTURECITY} - {flight.ARRIVALCITY}</div>
                  <div className={styles.flightNumber}>Flight {flight.FLIGHTNUMBER}</div>
                </div>
              </div>
              <div className={styles.price}>${flight.PRICE}</div>
            </div>

            <div className={styles.route}>
              <div className={styles.endpoint}>
                <div className={styles.time}>{formatTime(flight.DEPARTUREDATETIME)}</div>
                <div className={styles.airport}>{flight.DEPARTUREAIRPORT}</div>
              </div>

              <div className={styles.path}>
                <div className={styles.pathLine}>
                  <div className={styles.pathDot}></div>
                  <div className={styles.pathDot}></div>
                </div>
                <div className={styles.pathLabel}>{getDuration(flight.DEPARTUREDATETIME, flight.ARRIVALDATETIME)}</div>
              </div>

              <div className={styles.endpoint}>
                <div className={styles.time}>{formatTime(flight.ARRIVALDATETIME)}</div>
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
                  <span>{formatTime(flight.DEPARTUREDATETIME)}</span>
                </div>
              </div>
              <button 
                onClick={() => handleBookClick(flight)}
                className={styles.bookButton}
              >
                <CreditCard size={16} />
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <BookingModal 
          flight={selectedFlight} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </div>
  )
}
