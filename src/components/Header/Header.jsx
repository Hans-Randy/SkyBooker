import { Link } from 'react-router-dom'
import { Plane } from 'lucide-react'
import styles from './Header.module.css'

export default function Header() {
  return (
    <div className={styles.header}>
      <div className={styles.brand}>
        <Plane className={styles.icon} />
        <Link to="/" className={styles.link}>SkyBooker</Link>
      </div>
      <div className={styles.nav}>
        <Link to="/" className={styles.navItem}>Home</Link>
        <Link to="/booked" className={styles.navItem}>Booked</Link>
      </div>
    </div>
  )
}