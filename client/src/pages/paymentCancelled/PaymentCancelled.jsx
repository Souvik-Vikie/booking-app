import { useNavigate } from "react-router-dom";
import "./paymentCancelled.css";

const PaymentCancelled = () => {
  const navigate = useNavigate();

  return (
    <div className="paymentCancelled">
      <div className="cancelledContainer">
        <div className="cancelledIcon">✕</div>
        <h1>Payment Cancelled</h1>
        <p>Your payment was cancelled. No charges were made to your account.</p>
        <div className="buttonGroup">
          <button onClick={() => navigate(-1)} className="cancelledButton primary">
            Try Again
          </button>
          <button onClick={() => navigate("/")} className="cancelledButton secondary">
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelled;
