const Booking = require("../models/booking");
const Listing = require("../models/listing");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// -----------------------------
// Render Booking Form
// -----------------------------
module.exports.renderBookingForm = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  res.render("bookings/new", { listing });
};

// -----------------------------
// Stripe Checkout Session
// -----------------------------
module.exports.checkoutSession = async (req, res) => {
  const listing = await Listing.findById(req.params.id);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/listings/${listing._id}`,
    cancel_url: `${req.protocol}://${req.get("host")}/listings/${listing._id}`,
    customer_email: req.user.email,
    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: { name: listing.title },
          unit_amount: listing.price * 100, // Stripe expects paise
        },
        quantity: 1,
      },
    ],
  });

  res.redirect(session.url);
};

// -----------------------------
// Save booking after payment
// -----------------------------
module.exports.createBooking = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  const booking = new Booking({
    listing: id,
    user: req.user._id,
    checkIn: req.body.checkIn,
    checkOut: req.body.checkOut,
    totalPrice: req.body.totalPrice,
    paymentStatus: "paid",
  });

  await booking.save();
  req.flash("success", "Booking confirmed!");
  res.redirect(`/bookings/${booking._id}`);
};
