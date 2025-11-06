import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "../../utils/axios";
import "./paymentSuccess.css";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessionData, setSessionData] = useState(null);

  useEffect(() => {
    const updateBooking = async () => {
      const sessionId = searchParams.get("session_id");

      if (!sessionId) {
        setError("No session ID found");
        setLoading(false);
        return;
      }

      try {
        // Get session details from backend
        const response = await axios.get(`/payment/success?sessionId=${sessionId}`);

        if (response.data.success) {
          const metadata = response.data.metadata;
          const roomIds = JSON.parse(metadata.roomIds);
          const dates = JSON.parse(metadata.bookingDates);

          // Update room availability
          await Promise.all(
            roomIds.map((roomId) =>
              axios.put(`/rooms/availability/${roomId}`, {
                dates: dates,
              })
            )
          );

          setSessionData(response.data);
        } else {
          setError("Payment verification failed");
        }
      } catch (err) {
        console.error("Error updating booking:", err);
        setError("Failed to confirm booking. Please contact support.");
      } finally {
        setLoading(false);
      }
    };

    updateBooking();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="paymentSuccess">
        <div className="successContainer">
          <div className="loader"></div>
          <h2>Processing your booking...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="paymentSuccess">
        <div className="successContainer error">
          <div className="errorIcon">✕</div>
          <h2>Booking Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate("/")} className="successButton">
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="paymentSuccess">
      <div className="successContainer">
        <div className="successIcon">✓</div>
        <h1>Payment Successful!</h1>
        <p>Your booking has been confirmed.</p>
        <div className="bookingDetails">
          <h3>Booking Details</h3>
          <p>
            <strong>Number of Rooms:</strong>{" "}
            {sessionData?.metadata?.roomIds
              ? JSON.parse(sessionData.metadata.roomIds).length
              : "N/A"}
          </p>
          <p>
            <strong>Status:</strong> Confirmed
          </p>
        </div>
        <button onClick={() => navigate("/")} className="successButton">
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
