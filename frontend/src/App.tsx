import './App.css'
import { BrowserRouter as Router, Routes,Route} from 'react-router-dom'
import BookPage from './pages/BookPage'
import { CartProvider } from './context/CartContext'
import CartPage from './pages/CartPage'

function App() {


  return (
    <>
    <CartProvider>
      <Router>
          <Routes>
            <Route path="/" element={<BookPage/>}/>
            <Route path="/books" element={<BookPage/>}/>
            <Route path="/cart" element={<CartPage/>}/>
          </Routes>
        </Router>
    </CartProvider>
    </>
  )
}

export default App
