
// mapboxgl.accessToken = mapToken;

// const map = new mapboxgl.Map({
// container: 'map', // container ID
// style: 'mapbox://styles/mapbox/streets-v12', // style URL
// center: listing.geometry.coordinates, // starting position [lng, lat]
// zoom: 9 // starting zoom
// });

// const marker = new mapboxgl.Marker({color: "red"})
// .setLngLat(listing.geometry.coordinates) //Listing.geometry.coordinates
// .setPopup(
//     new mapboxgl.Popup({offset: 25}).setHTML(
//         `<h4>${listing.title}</h4><p>Exact Location will be  provided after booking</p>`
//     )
// )
// .addTo(map);

// if (!listing.geometry) {
//     console.warn("No geometry found for listing. Map cannot load.");
// } else {
//     mapboxgl.accessToken = mapToken;
//     const map = new mapboxgl.Map({
//         container: 'map',
//         style: 'mapbox://styles/mapbox/satellite-streets-v12',
//         center: listing.geometry.coordinates,
//         zoom: 9
//     });

//     new mapboxgl.Marker({color:"red"})
//         .setLngLat(listing.geometry.coordinates)
//         .setPopup(
//             new mapboxgl.Popup({offset:25})
//                 .setHTML(`<h4>${listing.title}</h4><p>Exact location will be provided after booking.</p>`)
//         )
//         .addTo(map);
// }

if (!listing || !listing.geometry) {
    console.warn("No geometry found for listing. Map cannot load.");
} else {
    mapboxgl.accessToken = mapToken;

    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        center: listing.geometry.coordinates, // [lng, lat]
        zoom: 9
    });

    new mapboxgl.Marker({ color: "red" })
        .setLngLat(listing.geometry.coordinates)
        .setPopup(
            new mapboxgl.Popup({ offset: 25 })
                .setHTML(`<h4>${listing.title}</h4><p>Exact location will be provided after booking.</p>`)
        )
        .addTo(map);
}
