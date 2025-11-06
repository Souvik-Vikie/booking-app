import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import "./checkoutForm.css";

const CheckoutForm = ({ onPaymentSuccess, amount }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/payment-success",
      },
      redirect: "if_required",
    });

    if (error) {
      setMessage(error.message);
      setIsLoading(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setMessage("Payment successful!");
      setIsLoading(false);
      onPaymentSuccess(paymentIntent);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <div className="payment-amount">
        <h3>Total Amount: ${amount}</h3>
      </div>
      <PaymentElement />
      <button disabled={isLoading || !stripe || !elements} className="pay-button">
        {isLoading ? "Processing..." : `Pay $${amount}`}
      </button>
      {message && <div className="payment-message">{message}</div>}
    </form>
  );
};

export default CheckoutForm;
