const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

console.log("MAP TOKEN ->", process.env.MAP_TOKEN);

const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

/* =========================
   INDEX (SHOW ALL LISTINGS)
========================= */
module.exports.index = async (req, res, next) => {
    try {
        const allListings = await Listing.find({});
        res.render("listings/index.ejs", { allListings });
    } catch (err) {
        console.error("❌ Error fetching listings:", err);
        next(err);
    }
};

/* =========================
   NEW FORM
========================= */
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

/* =========================
   CREATE LISTING
========================= */
module.exports.createListing = async (req, res, next) => {
    try {
        console.log("Uploaded file:", req.file);
        console.log("Form data:", req.body.listing);

        let response = await geocodingClient.forwardGeocode({
            query: req.body.listing.location,
            limit: 1,
        }).send();

        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;

        if (req.file) {
            newListing.image = {
                url: req.file.path,
                filename: req.file.filename
            };
        }

        if (response.body.features.length > 0) {
            newListing.geometry = response.body.features[0].geometry;
        } else {
            console.log("⚠️ No geocode results found for:", req.body.listing.location);
        }

        await newListing.save();
        req.flash("success", "New Listing Created!");
        res.redirect("/listings");
    } catch (err) {
        console.error("❌ Error creating listing:", err);
        next(err);
    }
};

/* =========================
   SHOW SINGLE LISTING
========================= */
module.exports.showListing = async (req, res, next) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id)
            .populate({ path: "reviews", populate: { path: "author" } })
            .populate("owner");

        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/listings");
        }

        res.render("listings/show.ejs", { 
            listing,
            mapToken: process.env.MAP_TOKEN
        });
    } catch (err) {
        console.error("❌ Error showing listing:", err);
        next(err);
    }
};

/* =========================
   EDIT FORM
========================= */
module.exports.renderEditForm = async (req, res, next) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);

        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/listings");
        }

        res.render("listings/edit.ejs", { listing });
    } catch (err) {
        console.error("❌ Error rendering edit form:", err);
        next(err);
    }
};

/* =========================
   UPDATE LISTING
========================= */
module.exports.updateListing = async (req, res, next) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });

        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/listings");
        }

        if (req.file) {
            listing.image = {
                url: req.file.path,
                filename: req.file.filename
            };
            await listing.save();
        }

        req.flash("success", "Listing updated successfully!");
        res.redirect(`/listings/${listing._id}`);
    } catch (err) {
        console.error("❌ Error updating listing:", err);
        next(err);
    }
};

/* =========================
   DELETE LISTING
========================= */
module.exports.destroyListing = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedListing = await Listing.findByIdAndDelete(id);

        if (!deletedListing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/listings");
        }

        req.flash("success", "Listing deleted successfully!");
        res.redirect("/listings");
    } catch (err) {
        console.error("❌ Error deleting listing:", err);
        next(err);
    }
};
