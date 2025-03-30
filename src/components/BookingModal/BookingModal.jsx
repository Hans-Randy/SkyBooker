import { useState } from 'react'
import { 
  Calendar, 
  Clock, 
  X, 
  User, 
  Mail, 
  Phone, 
  CreditCard, 
  Shield 
} from 'lucide-react'
import styles from './BookingModal.module.css'

export default function BookingModal({ flight, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert(`Booking confirmed for ${flight.airline} Flight ${flight.flightNumber}`)
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
              <div className={styles.pathLabel}>Direct</div>
            </div>

            <div className={styles.endpoint}>
              <div className={styles.time}>{flight.arrivalTime}</div>
              <div className={styles.airport}>{flight.to}</div>
            </div>
          </div>

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
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <h3 className={styles.formTitle}>Passenger Information</h3>

          <div className={styles.formGroup}>
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
              />
            </div>
          </div>

          <div className={styles.securityNote}>
            <Shield size={18} />
            <span>Your information is secure and will only be used for this booking</span>
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