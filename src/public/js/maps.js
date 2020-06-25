if ($('#map-add-form').length > 0) {
    // Init Add form map
    var map = L.map('map-add-form').setView([-33.867875, -65.951231], 6);

    L.tileLayer('http://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // On click add form map
    var markerAddForm

    // Charge marker if selected
    if ($("#add-form-lat").val() !== "") {
        markerAddForm = L.marker([$("#add-form-lat").val(), $("#add-form-lng").val()]).addTo(map);
        markerAddForm.bindPopup("Ubicación seleccionada").openPopup();
        $('#add-form-lat').attr("value", $("#add-form-lat").val())
        $('#add-form-lng').attr("value", $("#add-form-lng").val())
    }

    const onMapClick = (e) => {
        if (markerAddForm) {
            map.removeLayer(markerAddForm)
        }
        markerAddForm = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
        markerAddForm.bindPopup("Ubicación seleccionada").openPopup();
        $('#add-form-lat').attr("value", e.latlng.lat)
        $('#add-form-lng').attr("value", e.latlng.lng)
    }

    map.on('click', onMapClick);
}

if ($('#property-map').length > 0) {
    const location = [$("#property-lat").val(), $("#property-lng").val()]

    // Init Add form map
    var map = L.map('property-map').setView(location, 15);

    L.tileLayer('http://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const markerAddForm = L.marker(location).addTo(map)
    markerAddForm.bindPopup($("#property-address").val()).openPopup()
}