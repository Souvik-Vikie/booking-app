import Stripe from "stripe";

export const createCheckoutSession = async (req, res, next) => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const { amount, currency = "usd", roomDetails, dates, hotelId } = req.body;

    // Create a Checkout Session (Stripe Hosted Page)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: "Hotel Room Booking",
              description: `Booking for ${roomDetails.length} room(s)`,
            },
            unit_amount: Math.round(amount * 100), // Stripe expects amount in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL || "http://localhost:3000"}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL || "http://localhost:3000"}/payment-cancelled`,
      metadata: {
        roomIds: JSON.stringify(roomDetails),
        bookingDates: JSON.stringify(dates),
        hotelId: hotelId,
        userId: req.user?.id || "guest",
      },
    });

    res.status(200).json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (err) {
    console.error("Stripe checkout session creation error:", err);
    next(err);
  }
};

export const handleSuccess = async (req, res, next) => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { sessionId } = req.query;

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      res.status(200).json({
        success: true,
        message: "Payment successful",
        session,
        metadata: session.metadata,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Payment not completed",
        status: session.payment_status,
      });
    }
  } catch (err) {
    next(err);
  }
};

export const createPaymentIntent = async (req, res, next) => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const { amount, currency = "usd", roomDetails, dates } = req.body;

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe expects amount in cents
      currency: currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        roomIds: JSON.stringify(roomDetails),
        bookingDates: JSON.stringify(dates),
      },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (err) {
    next(err);
  }
};

export const confirmPayment = async (req, res, next) => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { paymentIntentId } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === "succeeded") {
      res.status(200).json({
        success: true,
        message: "Payment confirmed successfully",
        paymentIntent,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Payment not completed",
        status: paymentIntent.status,
      });
    }
  } catch (err) {
    next(err);
  }
};
