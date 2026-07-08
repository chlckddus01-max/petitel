import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'
import OAuthCallback from './pages/OAuthCallback'
import Hotels from './pages/Hotels'
import HotelDetail from './pages/HotelDetail'
import MyPage from './pages/MyPage'
import ReservationNew from './pages/ReservationNew'
import Reservations from './pages/Reservations'

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/oauth/callback" element={<OAuthCallback />} />
                <Route path="/hotels" element={<Hotels />} />
                <Route path="/hotels/:id" element={<HotelDetail />} />
                <Route path="/mypage" element={<MyPage />} />
                <Route path="/reservations/new" element={<ReservationNew />} />
                <Route path="/reservations" element={<Reservations />} />
            </Routes>
        </BrowserRouter>
    )
}