import { Calendar, CheckCircle, Ticket, User, Clock, Tag } from 'lucide-react'
import styles from './BookedFlightList.module.css'
import { useEffect, useState } from 'react'
import { formatDate, formatTime, getDuration } from '../../utils/formatters';

export default function BookedFlightList({ flights }) {
  const [passenger, setPassenger] = useState('')
  const [passengerOptions, setPassengerOptions] = useState([]);
  const [bookedFlights, setBookedFlights] = useState([]);

  useEffect(() => {
    async function fetchPassengers() {
      try {
        const res = await fetch('/api/passengers');
        const data = await res.json();
        setPassengerOptions(data);
      } catch (err) {
        console.error('Error fetching passengers:', err);
      }
    }

    fetchPassengers();
  }, []);

  //flight search every time search states change
  useEffect(() => {
    async function fetchBookedFlights() {
      if (!passenger) {
        setBookedFlights([]); // Optionally clear list when none selected
        return;
      }

      try {
        const res = await fetch(`/api/booked-flights?passengerId=${passenger}`);
        const data = await res.json();
        setBookedFlights(data);
      } catch (err) {
        console.error('Error fetching flights:', err);
      }
    }

    fetchBookedFlights();
  }, [passenger]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Your Bookings</h2>

      <div className={styles.filters}>
        <div className={styles.dropdown}>
          <select value={passenger} onChange={e => setPassenger(e.target.value)}>
            <option value="">Select Passenger</option>
            {passengerOptions.map((passenger) => (
              <option key={passenger.id} value={passenger.id}>
                {passenger.name} ({passenger.email})
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {!passenger && (
        <div className={styles.empty}>
          <p>Please select a passenger...</p>
        </div>
      )}
      
      {passenger && bookedFlights.length === 0 && (
        <div className={styles.empty}>
          <p>No bookings found for this passenger...</p>
        </div>
      )}
      
      {passenger && bookedFlights.length > 0 && (
        <div className={styles.list}>
          {bookedFlights.map((flight) => (
            <div key={flight.FLIGHTID} className={styles.card}>
              <div className={styles.header}>
                <div className={styles.airline}>
                  <div className={styles.airlineIcon}>
                    <Ticket size={24} />
                  </div>
                  <div>
                    <div className={styles.airlineName}>{flight.DEPARTURECITY} - {flight.ARRIVALCITY}</div>
                    <div className={styles.flightNumber}>Flight {flight.FLIGHTNUMBER}</div>
                  </div>
                </div>
                <div className={styles.status}>
                  <Tag size={18} />
                  <span>Status</span>
                </div>
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
                    <span>{getDuration(flight.DEPARTUREDATETIME, flight.ARRIVALDATETIME)}</span>
                  </div>
                  <div className={styles.detail}>
                    <User size={16} />
                    <span>{passengerOptions.find(p => p.id === parseInt(passenger))?.name||"Unknown Passenger"}</span>
                  </div>
                </div>
                
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}