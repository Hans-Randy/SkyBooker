import { Calendar, CheckCircle, Ticket, User } from 'lucide-react'
import styles from './BookedFlightList.module.css'

export default function BookedFlightList({ flights }) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Your Bookings</h2>
      
      {flights.length === 0 ? (
        <div className={styles.empty}>
          <p>No bookings yet</p>
        </div>
      ) : (
        <div className={styles.list}>
          {flights.map((flight) => (
            <div key={flight.bookingId} className={styles.card}>
              <div className={styles.header}>
                <div className={styles.airline}>
                  <div className={styles.airlineIcon}>
                    <Ticket size={24} />
                  </div>
                  <div>
                    <div className={styles.airlineName}>{flight.airline}</div>
                    <div className={styles.flightNumber}>Flight {flight.flightNumber}</div>
                  </div>
                </div>
                <div className={styles.status}>
                  <CheckCircle size={18} />
                  <span>{flight.status}</span>
                </div>
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
                  <div className={styles.pathLabel}>Direct</div>
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
                    <User size={16} />
                    <span>Passenger Name</span>
                  </div>
                </div>
                <div className={styles.bookingId}>
                  <Ticket size={16} />
                  <span>Booking ID: {flight.bookingId}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}