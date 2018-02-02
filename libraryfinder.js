$(function () {

    var librarymap = L.map('map').setView([51.505, -0.09], 13);

    var colours = {
        'Bath and North East Somerset': { colour: [255, 99, 132] },
        'Somerset': { colour: [54, 162, 235] },
        'North Somerset': { colour: [255, 206, 86] },
        'South Gloucestershire': { colour: [75, 192, 192] },
        'Dorset': { colour: [153, 102, 255] },
        'Poole': { colour: [255, 159, 64] },
        'Bristol': { colour: [255, 204, 0] }
    };

    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/{id}/{z}/{x}/{y}@2x.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution" > CARTO</a>',
        maxZoom: 18,
        id: 'light_all',
    }).addTo(librarymap);

    var clickLibrary = function (library, e) {
        $('#library').empty();
        $('#library').append(
            '<h4>' + library.properties.name + '</h4>' +
            '<p class="small">A ' + library.properties.authority + ' at ' + library.properties.location + ' library</p>' +
            '<p>Further library details here including opening hours, image, and address.</p>'
        );
    };

    var libraries = null, librariesdt = [];

    $.ajax({
        dataType: "json",
        url: "libraries.json",
        success: function (data) {

            $.each(data.features, function (i, f) {
                librariesdt.push([f.properties.name, f.properties.authority, f.properties.location, f.properties.postcode, f.properties.email, f.properties.website, 0]);
            });

            // Load the data
            libraries = new L.geoJson(data, {
                pointToLayer: function (feature, latlng) {
                    var c = colours[feature.properties.authority.replace('NE', 'North East')].colour;
                    return L.circleMarker(latlng, {
                        radius: 5,
                        fillColor: 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')',
                        color: "#ccc",
                        opacity: 1,
                        weight: 1,
                        fillOpacity: 1
                    });
                },
                onEachFeature: function (feature, layer) {
                    layer.on('click', clickLibrary.bind(this, feature));
                }
            });
            libraries.addTo(librarymap);

            $('#tbl-libraries').DataTable({
                data: librariesdt,
                columns: [
                    { title: 'Name' },
                    { title: 'Authority' },
                    { title: 'Address' },
                    { title: 'Postcode' },
                    {
                        title: 'Email',
                        render: function (data, type, row) {
                            return '<a href="mailto:' + data + '" target="_blank">Email</a>';
                        },
                    },
                    {
                        title: 'Website',
                        render: function (data, type, row) {
                            return '<a href="' + data + '" target="_blank">Website</a>';
                        },
                    },
                    { title: 'Distance' }
                ]
            });
            librarymap.fitBounds(libraries.getBounds());
        }
    }).error(function (err) {
        console.log(err);
        });

    // Find nearest
    $('#btn-search').on('click', function () {
        // Get postcode lookup
        $.getJSON('https://api.postcodes.io/postcodes/' + $('#txt-search').val(), function (data) {
            // data.results
            alert(data);
        });
    });
});