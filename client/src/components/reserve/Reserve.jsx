import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

import "./reserve.css";
import useFetch from "../../hooks/useFetch";
import { useContext, useState } from "react";
import { SearchContext } from "../../context/SearchContext";
import axios from "../../utils/axios";
import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const Reserve = ({ setOpen, hotelId }) => {
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { data, loading, error } = useFetch(`/hotels/room/${hotelId}`);
  const { dates } = useContext(SearchContext);

  const getDatesInRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const date = new Date(start.getTime());

    const dates = [];

    while (date <= end) {
      dates.push(new Date(date).getTime());
      date.setDate(date.getDate() + 1);
    }

    return dates;
  };

  const alldates = getDatesInRange(dates[0].startDate, dates[0].endDate);

  const isAvailable = (roomNumber) => {
    const isFound = roomNumber.unavailableDates.some((date) =>
      alldates.includes(new Date(date).getTime())
    );

    return !isFound;
  };

  const handleSelect = (e) => {
    const checked = e.target.checked;
    const value = e.target.value;
    setSelectedRooms(
      checked
        ? [...selectedRooms, value]
        : selectedRooms.filter((item) => item !== value)
    );
  };

  // Calculate total amount based on selected rooms
  const calculateTotalAmount = () => {
    let total = 0;
    selectedRooms.forEach((roomId) => {
      const room = data
        .flatMap((item) => item.roomNumbers)
        .find((r) => r._id === roomId);
      if (room) {
        const roomData = data.find((item) =>
          item.roomNumbers.some((r) => r._id === roomId)
        );
        const nights = alldates.length;
        total += roomData.price * nights;
      }
    });
    return total;
  };

  const handleClick = async () => {
    try {
      if (selectedRooms.length === 0) {
        alert("Please select at least one room");
        return;
      }

      setIsProcessing(true);

      // Calculate total amount
      const amount = calculateTotalAmount();
      console.log("Creating checkout session with amount:", amount);

      // Create Stripe Checkout Session
      const response = await axios.post("/payment/create-checkout-session", {
        amount: amount,
        currency: "usd",
        roomDetails: selectedRooms,
        dates: alldates,
        hotelId: hotelId,
      });

      console.log("Checkout session response:", response.data);

      const { sessionId, url } = response.data;

      if (!sessionId) {
        throw new Error("No session ID received from server");
      }

      // Redirect to Stripe Checkout using the URL directly (faster and more reliable)
      if (url) {
        console.log("Redirecting to Stripe URL:", url);
        window.location.href = url;
      } else {
        // Fallback: Use Stripe.js redirectToCheckout
        console.log("Using Stripe.js redirect with sessionId:", sessionId);
        const stripe = await stripePromise;
        const { error } = await stripe.redirectToCheckout({
          sessionId: sessionId,
        });

        if (error) {
          console.error("Stripe redirect error:", error);
          alert("Failed to redirect to payment page. Please try again.");
          setIsProcessing(false);
        }
      }
    } catch (err) {
      console.error("Payment initialization failed:", err);
      console.error("Error details:", err.response?.data || err.message);
      alert("Failed to initialize payment. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="reserve">
      <div className="rContainer">
        <FontAwesomeIcon
          icon={faCircleXmark}
          className="rClose"
          onClick={() => setOpen(false)}
        />
        <span>Select your rooms:</span>
        {data.map((item) => (
          <div className="rItem" key={item._id}>
            <div className="rItemInfo">
              <div className="rTitle">{item.title}</div>
              <div className="rDesc">{item.desc}</div>
              <div className="rMax">
                Max people: <b>{item.maxPeople}</b>
              </div>
              <div className="rPrice">${item.price} per night</div>
            </div>
            <div className="rSelectRooms">
              {item.roomNumbers.map((roomNumber) => (
                <div className="room" key={roomNumber._id}>
                  <label>{roomNumber.number}</label>
                  <input
                    type="checkbox"
                    value={roomNumber._id}
                    onChange={handleSelect}
                    disabled={!isAvailable(roomNumber)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
        <button
          onClick={handleClick}
          className="rButton"
          disabled={isProcessing || selectedRooms.length === 0}
        >
          {isProcessing ? "Processing..." : "Reserve Now!"}
        </button>
      </div>
    </div>
  );
};

export default Reserve;
