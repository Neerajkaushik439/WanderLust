

mapboxgl.accessToken =  mapToken
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11', // container ID
    center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 10 // starting zoom
});
console.log(listing.geometry.coordinates)


const marker = new mapboxgl.Marker({color :  `#ff385c`}  )
.setLngLat(listing.geometry.coordinates)
.setPopup(new mapboxgl.Popup({offset: 25}).setHTML(listing.location))
.addTo(map);
