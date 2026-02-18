const express = require("express");
const router = express.Router({ mergeParams: true });
const { isLoggedIn } = require("../middleware");
const bookingController = require("../controllers/bookings");

router.get("/new", isLoggedIn, bookingController.renderBookingForm);

// Stripe checkout route
router.post("/checkout", isLoggedIn, bookingController.checkoutSession);

router.post("/", isLoggedIn, bookingController.createBooking);

module.exports = router;
