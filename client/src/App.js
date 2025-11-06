import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Home from "./pages/home/Home";
import Hotel from "./pages/hotel/Hotel";
import List from "./pages/list/List";
import Login from "./pages/login/Login";
import PaymentSuccess from "./pages/paymentSuccess/PaymentSuccess";
import PaymentCancelled from "./pages/paymentCancelled/PaymentCancelled";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/hotels" element={<List/>}/>
        <Route path="/hotels/:id" element={<Hotel/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/payment-success" element={<PaymentSuccess/>}/>
        <Route path="/payment-cancelled" element={<PaymentCancelled/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
