#!/usr/bin/node

/*
JavaScript script that display all places
URL: http://0.0.0.0:5001/api/v1/places_search/
Use the JQuery API
*/

const amenityId = [];

document.addEventListener('DOMContentLoaded', async function () {
    // listen for changes on each input checkbox tag
    window.$('input[type=checkbox]').change(function() {
        if (window.$(this).is(':checked')) {
            amenityId.push($(this).attr('data-name'));
        } else {
            amenityId.splice(amenityId.indexOf($(this).attr('data-name')), 1);
        }
        if (amenityId.length === 0) {
            $('.amenities h4').html('&nbsp;');
        } else {
            $('.amenities h4').html(amenityId.join(', '));
        }
    });

    // check api status and add the class available
    const url = 'http://localhost:5001/api/v1/status/';
    const status = await $.getJSON(url, (data) => {
        if (data.status === 'OK') {
            $('#api_status').addClass("available");
        } else {
            $('#api_status').removeClass("available");
        }
    });

    // display all places
    let response = await fetch('http://localhost:5001/api/v1/places_search/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: {}
    })

    let resUsers = await fetch('http://localhost:5001/api/v1/users/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        data: {}
    })

    response.json().then(data => {
        const places = Object.values(data);
        resUsers.json().then(dataUser => {
            const users = Object.values(dataUser);
            let userName = '';

            for (const place of places) {
                // get the user name
                for (const user of users) {
                    if (user.id === place.user_id) {
                        userName = user.first_name + ' ' + user.last_name;
                    }
                }
                //

                const infos = {
                    guests: "Guest",
                    rooms: "Bedroom",
                    bathrooms: "Bathroom",
                }
                if (place.max_guest !== 1)
                    infos.guests = "Guests";
                if (place.number_rooms !== 1)
                    infos.rooms = "Bedrooms";
                if (place.number_bathrooms !== 1)
                    infos.bathrooms = "Bathrooms";

                    console.log(userName);
                const article = `
                    <article>
                        <div class="title_box">
                            <h2>${ place.name }</h2>
                            <div class="price_by_night">$${ place.price_by_night }</div>
                        </div>
                        <div class="information">
                            <div class="max_guest">${ place.max_guest } ${ infos.guests }</div>
                            <div class="number_rooms">${ place.number_rooms } ${ infos.rooms }</div>
                            <div class="number_bathrooms">${ place.number_bathrooms } ${ infos.bathrooms }</div>
                        </div>
                        <div class="user">
                            <b>Owner:</b> ${ userName }
                        </div>
                        <div class="description">
                            ${ place.description }
                        </div>
                    </article>
                `
                $('.places').append(article);
            }
        });
    });
});
