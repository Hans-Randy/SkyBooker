import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  Calendar,
  Clock,
  X,
  User,
  Mail,
  Phone,
  CreditCard,
  BookUser,
  BookOpen,
} from "lucide-react";
import styles from "./BookingModal.module.css";
import { formatDate, formatTime, getDuration } from "../../utils/formatters";
import {
  fetchPassengers,
  createPassenger,
  createBooking,
} from "../../utils/api";

export default function BookingModal({ flight, onClose, refreshFlights }) {
  const [passengerOptions, setPassengerOptions] = useState([]);
  const [isExisting, setIsExisting] = useState(false);

  useEffect(() => {
    async function loadPassengers() {
      try {
        const data = await fetchPassengers();
        setPassengerOptions(data);
      } catch (err) {
        console.error("Error fetching passengers:", err);
      }
    }

    loadPassengers();
  }, []);

  const [formData, setFormData] = useState({
    passengerId: "",
    name: "",
    email: "",
    phone: "",
    passport: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let passengerId = formData.passengerId;
    try {
      if (!isExisting) {
        // Create passenger
        const newPassenger = await createPassenger({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          passport: formData.passport,
        });
        passengerId = newPassenger.id;
      }

      // Create booking
      await createBooking({
        passengerId,
        flightId: flight.FLIGHTID,
      });

      toast.success("Booking successful!");
      onClose();
      await refreshFlights?.();
    } catch (err) {
      console.error("Booking error:", err);
      toast.error(`Booking failed: ${err.message}`);
    }
  };

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
                {flight.DEPARTUREAIRPORTCODE}
              </div>
            </div>

            <div className={styles.path}>
              <div className={styles.pathLine}>
                <div className={styles.pathDot}></div>
                <div className={styles.pathDot}></div>
              </div>
              <div className={styles.pathLabel}>
                {getDuration(flight.DEPARTUREDATETIME, flight.ARRIVALDATETIME)}
              </div>
            </div>

            <div className={styles.endpoint}>
              <div className={styles.time}>
                {formatTime(flight.ARRIVALDATETIME)}
              </div>
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
              <span>
                {getDuration(flight.DEPARTUREDATETIME, flight.ARRIVALDATETIME)}
              </span>
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
                value={formData.passengerId || ""}
                onChange={(e) => {
                  const selectedId = parseInt(e.target.value);
                  const selected = passengerOptions.find(
                    (p) => p.id === selectedId
                  );

                  if (selected) {
                    setIsExisting(true);
                    setFormData({
                      passengerId: selected.id,
                      name: selected.name,
                      email: selected.email,
                      phone: selected.phone,
                      passport: selected.passport,
                    });
                  } else {
                    // Reset to manual entry
                    setIsExisting(false);
                    setFormData({
                      passengerId: "",
                      name: "",
                      email: "",
                      phone: "",
                      passport: "",
                    });
                  }
                }}
              >
                <option value="">Select a Passenger</option>
                {passengerOptions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.email})
                  </option>
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
  );
}
