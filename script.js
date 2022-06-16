//=========================================================================================================
// Initialization
// Setting up a load handler to do the main startup work once the page is fully loaded.
//
//=========================================================================================================

window.addEventListener("load", startup, false);

function startup() {

    document.querySelector(".form-postcode").addEventListener("submit",getPostcode);
}

//=========================================================================================================
// getPostcode()
// Get the postcode from the user
//
//=========================================================================================================


let userLat;
let userLong;

function getPostcode(event){

    event.preventDefault();
        
    let postcode = document.querySelector("#postcode").value;
    console.log(postcode); // For testing


    const postCodeURL = `https://api.postcodes.io/postcodes/${postcode}`;

    const postCodePromise = fetch(postCodeURL);
    
    
    
    postCodePromise
    .then(
        (response) => {
            if (response.ok == false) {console.log(`Error, response status is ${response.status}`);}
            else {return response.json();}
        }
    )
    .then(
        (body) => {
                console.log(body);
                console.log(body.result.latitude);
                console.log(body.result.longitude);
                userLat = body.result.latitude;
                userLong = body.result.longitude;
                
                
                var map = L.map('map').setView([userLat, userLong], 13.53);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    attribution: '© OpenStreetMap'
                }).addTo(map);
            }
    )
    .catch(
        (error) => {console.log(error);}
    );
}

/*
function initMap() {


    // The location of the user input by lat & long
    const usersChosenLocationCoordinates = {lat: userLat, lng: userLong}
    // The map, centered at the user's chosen location
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 13.53,
        center: usersChosenLocationCoordinates,
      });
      // The marker, positioned at the user's chosen location
      const marker = new google.maps.Marker({
        position: usersChosenLocationCoordinates,
        map: map,
      });
*/

      /*a coloured circle of a 1 mile radius around the user's chosen location.
      right now it's red but later we can add some if statements to make it amber or green
      based on the level of crime
      */
/*
      const cityCircle = new google.maps.Circle({
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        map,
        center: usersChosenLocationCoordinates,
        radius: 1609.34,
      });  

}

window.initMap = initMap;
*/
