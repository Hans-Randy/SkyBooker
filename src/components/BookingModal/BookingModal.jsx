import { useEffect, useState } from 'react'
import { 
  Calendar, 
  Clock, 
  X, 
  User, 
  Mail, 
  Phone, 
  CreditCard, 
  BookUser,
  BookOpen
} from 'lucide-react'
import styles from './BookingModal.module.css'
import { formatDate, formatTime, getDuration } from '../../utils/formatters'



export default function BookingModal({ flight, onClose }) {
  const [passengerOptions, setPassengerOptions] = useState([]);
  const [isExisting, setIsExisting] = useState(false);

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

  const [formData, setFormData] = useState({
    passengerId: '',
    name: '',
    email: '',
    phone: '',
    passport: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      let passengerId = formData.passengerId;
  
      if (!isExisting) {
        // Create passenger
        const createRes = await fetch('/api/passengers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            passport: formData.passport
          })
        });
  
        if (!createRes.ok) throw new Error('Failed to create passenger');
  
        // Fetch updated passenger list to get ID
        const updatedPassengers = await fetch('/api/passengers');
        const updatedList = await updatedPassengers.json();
        const newPassenger = updatedList.find(p => p.email === formData.email);
        if (!newPassenger) throw new Error('New passenger not found');
        passengerId = newPassenger.id;
      }
  
      // Create booking
      const bookingRes = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passengerId, flightId: flight.FLIGHTID })
      });
  
      if (!bookingRes.ok) throw new Error('Failed to book flight');
      alert('✅ Booking successful!');
      onClose();
    } catch (err) {
      console.error('Booking error:', err);
      alert(`❌ Booking failed: ${err.message}`);
    }
    onClose()
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.title}>
            <CreditCard size={20} />
            <span>Complete Your Booking</span>
          </div>
          <button onClick={onClose} className={styles.closeButton}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.summary}>
          <div className={styles.summaryHeader}>
            <div className={styles.airline}>
              <div className={styles.airlineIcon}>
                <CreditCard size={24} />
              </div>
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
              <div className={styles.airport}>{flight.DEPARTUREAIRPORTCODE}</div>
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
              <div className={styles.airport}>{flight.ARRIVALAIRPORTCODE}</div>
            </div>
          </div>

          <div className={styles.details}>
            <div className={styles.detail}>
              <Calendar size={16} />
              <span>{formatDate(flight.DEPARTUREDATETIME)}</span>
            </div>
            <div className={styles.detail}>
              <Clock size={16} />
              <span>{getDuration(flight.DEPARTUREDATETIME, flight.ARRIVALDATETIME)}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <h3 className={styles.formTitle}>Passenger Information</h3>

          <div className={styles.formGroup}>
          <label className={styles.label}>Select Existing Passenger</label>
          <div className={styles.inputContainer}>
            <div className={styles.inputIcon}>
                <BookUser size={18} />
            </div>
            <select
              className={styles.input}
              value={formData.passengerId || ''}
              onChange={(e) => {
                const selected = passengerOptions.find(p => p.id === parseInt(e.target.value))
                setIsExisting(true)
                setFormData(prev => ({
                  ...prev,
                  passengerId: selected?.id || '',
                  name: selected?.name || '',
                  email: selected?.email || '',
                  phone: selected?.phone || '',
                  passport: selected?.passport || '',
                }))
              }}
            >
              <option value="">Select a Passenger</option>
              {passengerOptions.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
            <label className={styles.label}>Full Name</label>
            <div className={styles.inputContainer}>
              <div className={styles.inputIcon}>
                <User size={18} />
              </div>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                className={styles.input}
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isExisting}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Email Address</label>
            <div className={styles.inputContainer}>
              <div className={styles.inputIcon}>
                <Mail size={18} />
              </div>
              <input
                type="email"
                name="email"
                placeholder="john@example.com"
                className={styles.input}
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isExisting}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Phone Number</label>
            <div className={styles.inputContainer}>
              <div className={styles.inputIcon}>
                <Phone size={18} />
              </div>
              <input
                type="tel"
                name="phone"
                placeholder="+1 (123) 456-7890"
                className={styles.input}
                value={formData.phone}
                onChange={handleChange}
                required
                disabled={isExisting}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Passport Number</label>
            <div className={styles.inputContainer}>
              <div className={styles.inputIcon}>
                <BookOpen size={18} />
              </div>
              <input
                type="text"
                name="passport"
                placeholder="AA111111"
                className={styles.input}
                value={formData.passport}
                onChange={handleChange}
                required
                disabled={isExisting}
              />
            </div>
          </div>

          <div className={styles.actions}>
            <button type="submit" className={styles.submitButton}>
              <CreditCard size={18} />
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}