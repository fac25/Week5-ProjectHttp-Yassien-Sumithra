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

let allCrimeTotal;

const months = [`January`, `February`, `March`, `April`, `May`, `June`, `July`, `August`, `September`, `October`, `November`, `December`];

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
                
                getCrimeTotal();
                getPoliceApiDate();
                getMap();

            }
    )
    .catch(
        (error) => {console.log(error);}
    );
}

//=========================================================================================================
// getMap()
// getMap() takes latitude and longitude as input and displays the map
//
//=========================================================================================================

function getMap(){

    

    var map = L.map('map').setView([userLat, userLong], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    var marker = L.marker([userLat, userLong]).addTo(map);

    var circle = L.circle([userLat, userLong], {
        color: 'red',
        fillColor: '#ff0000',
        fillOpacity: 0,
        radius: 1609.34
    }).addTo(map);

   // marker.bindPopup().openPopup();

}

//=========================================================================================================
// getCrimes()
// getCrimes() takes latitude and longitude as input and retrieves relevant crime data
//
//=========================================================================================================

function getCrimeTotal() {

    let policeURL = `https://data.police.uk/api/crimes-street/all-crime?lat=${userLat}&lng=${userLong}`;

    const policePromise = fetch(policeURL);

    policePromise  
    .then(
        (response) => {
            if (response.ok == false) {console.log(`Error, response status is ${response.status}`);}
            else {return response.json();}
        }
    )
    .then(
        (body) => {
            console.log(body.length);
            
            allCrimeTotal = body.length;
            document.querySelector("#crimeTotal").innerHTML = allCrimeTotal;
            document.querySelector("#headlineCrimeFigure").style.display = "block";
        }
    )
    .catch(
        (error) => {console.log(error);}
    );

}

//=========================================================================================================
// getPoliceApiDate()
// getPoliceApiDate() retrieves the month for which the stats apply 
//
//=========================================================================================================

function getPoliceApiDate() {
    let policeDateURL = `https://data.police.uk/api/crime-last-updated`;
    
    let dateForWhichPoliceApiSearchResultsApply;
    
    const policeDatePromise = fetch(policeDateURL);
    
    
    policeDatePromise
    
    .then(
        (response) => {
            if (response.ok == false) {console.log(`Error, response status is ${response.status}`);}
            else {return response.json();}
        }
    )
    .then(
        (body) => {
            console.log(body);
            console.log(body.date);
            console.log(body.date[5]);
            console.log(body.date[6]);
            dateForWhichPoliceApiSearchResultsApply = `${body.date[5]}${body.date[6]}`
            console.log(dateForWhichPoliceApiSearchResultsApply);

            if (dateForWhichPoliceApiSearchResultsApply == 01) {document.querySelector("#chosenMonth").innerHTML = months[0];}
            else if (dateForWhichPoliceApiSearchResultsApply == 02) {document.querySelector("#chosenMonth").innerHTML = months[1];}
            else if (dateForWhichPoliceApiSearchResultsApply == 03) {document.querySelector("#chosenMonth").innerHTML = months[2];}
            else if (dateForWhichPoliceApiSearchResultsApply == 04) {document.querySelector("#chosenMonth").innerHTML = months[3];}
            else if (dateForWhichPoliceApiSearchResultsApply == 05) {document.querySelector("#chosenMonth").innerHTML = months[4];}
            else if (dateForWhichPoliceApiSearchResultsApply == 06) {document.querySelector("#chosenMonth").innerHTML = months[5];}
            else if (dateForWhichPoliceApiSearchResultsApply == 07) {document.querySelector("#chosenMonth").innerHTML = months[6];}
            else if (dateForWhichPoliceApiSearchResultsApply == 08) {document.querySelector("#chosenMonth").innerHTML = months[7];}
            else if (dateForWhichPoliceApiSearchResultsApply == 09) {document.querySelector("#chosenMonth").innerHTML = months[8];}
            else if (dateForWhichPoliceApiSearchResultsApply == 10) {document.querySelector("#chosenMonth").innerHTML = months[9];}
            else if (dateForWhichPoliceApiSearchResultsApply == 11) {document.querySelector("#chosenMonth").innerHTML = months[10];}
            else {document.querySelector("#chosenMonth").innerHTML = months[11];}
        } 
    )
    .catch(
        (error) => {console.log(error);}
    );
}


    
    
