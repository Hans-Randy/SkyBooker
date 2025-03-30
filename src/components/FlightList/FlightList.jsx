import { Clock, Calendar, Plane, CreditCard, ArrowRightLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import styles from './FlightList.module.css'
import BookingModal from '../BookingModal/BookingModal'
import { flights } from '../../data'

export default function FlightList() {
  const [selectedFlight, setSelectedFlight] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const [fromAirport, setFromAirport] = useState('')
  const [toAirport, setToAirport] = useState('')
  const [departureDate, setDepartureDate] = useState('')

  const [airportOptions, setAirportOptions] = useState([])

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
          <select value={toAirport} onChange={e => setToAirport(e.target.value)}>
            <option value="">To Airport</option>
            {airportOptions.map((airport) => (
              <option key={airport.id} value={airport.id}>
                {airport.label}
              </option>
            ))}
          </select>
        </div>

        <input
          type="date"
          value={departureDate}
          onChange={e => setDepartureDate(e.target.value)}
          className={styles.dateInput}
        />
      </div>

      <div className={styles.list}>
        {flights.map((flight) => (
          <div key={flight.id} className={styles.card}>
            <div className={styles.header}>
              <div className={styles.airline}>
                <Plane className={styles.airlineIcon} />
                <div>
                  <div className={styles.airlineName}>{flight.airline}</div>
                  <div className={styles.flightNumber}>Flight {flight.flightNumber}</div>
                </div>
              </div>
              <div className={styles.price}>{flight.price}</div>
            </div>

            <div className={styles.route}>
              <div className={styles.endpoint}>
                <div className={styles.time}>{flight.departureTime}</div>
                <div className={styles.airport}>{flight.from}</div>
              </div>

              <div className={styles.path}>
                <div className={styles.pathLine}>
                  <div className={styles.pathDot}></div>
                  <div className={styles.pathDot}></div>
                </div>
                <div className={styles.pathLabel}>{flight.duration}</div>
              </div>

              <div className={styles.endpoint}>
                <div className={styles.time}>{flight.arrivalTime}</div>
                <div className={styles.airport}>{flight.to}</div>
              </div>
            </div>

            <div className={styles.footer}>
              <div className={styles.details}>
                <div className={styles.detail}>
                  <Calendar size={16} />
                  <span>{flight.date}</span>
                </div>
                <div className={styles.detail}>
                  <Clock size={16} />
                  <span>{flight.duration}</span>
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
