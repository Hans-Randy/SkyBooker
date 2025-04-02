import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header'
import FlightList from './components/FlightList/FlightList'
import BookedFlightList from './components/BookedFlightList/BookedFlightList'
import { Toaster } from 'react-hot-toast';
import { flights as sampleFlights } from './data'

export default function App() {
  const [bookedFlights, setBookedFlights] = useState([])

  const handleBookFlight = (flight) => {
    setBookedFlights([...bookedFlights, {
      ...flight,
      bookingId: `BK-${Math.random().toString(36).substr(2, 8)}`,
      status: 'Confirmed'
    }])
  }

  return (
    <div className="app">
      <Toaster position="bottom-right" />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<FlightList onBookClick={handleBookFlight} />} />
          <Route path="/booked" element={<BookedFlightList flights={bookedFlights} />} />
        </Routes>
      </main>
    </div>
  )
}