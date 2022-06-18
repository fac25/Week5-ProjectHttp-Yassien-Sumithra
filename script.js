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
let antiSocialBehaviourTotal;
let bicycleTheftTotal;
let burglaryTotal;
let criminalDamageArsonTotal;
let drugsTotal;
let otherTheftTotal;
let possessionOfWeaponsTotal;
let publicOrderTotal;
let robberyTotal;
let shopliftingTotal;
let theftFromThePersonTotal;
let vehicleCrimeTotal;
let violentCrimeTotal;
let otherCrimeTotal;

let onlyChosenCategoriesTotal;

const months = [`January`, `February`, `March`, `April`, `May`, `June`, `July`,
`August`, `September`, `October`, `November`, `December`];

const crimeCategories = [`all-crime`, `anti-social-behaviour`, `bicycle-theft`,
 `burglary`, `criminal-damage-arson`, `drugs`, `other-theft`,
  `possession-of-weapons`,`public-order`, `robbery`, `shoplifting`, 
  `theft-from-the-person`, `vehicle-crime`, `violent-crime`, `other-crime`];

const crimeCategoriesNames = [`All crime`, `Anti-social behaviour`, `Bicycle theft`,
`Burglary`, `Criminal damage and arson`, `Drugs`, `Other theft`,
 `Possession of weapons`,`Public order`, `Robbery`, `Shoplifting`, 
 `Theft from the person`, `Vehicle crime`, `Violent crime`, `Other crime`];  

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
                
                getMap();

                getPoliceApiDate();
                
                getAllCrime();
                getAntiSocialBehaviour();
                getBicycleTheft();
                getBurglary();
                getCriminalDamageArson();
                getDrugs();
                getOtherTheft();
                getPossessionOfWeapons();
                getPublicOrder();
                getRobbery();
                getShoplifting();
                getTheftFromThePerson();
                getVehicleCrime();
                getViolentCrime();
                getOtherCrime();

                

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
// displayTab()
// 
//
//=========================================================================================================

function displayTab(e, tabName) {

    //Hide All Tabs
    document.querySelector("#summary-tab-content").style.display = "none";
    document.querySelector("#crime-tab-content").style.display = "none";


    //Show the Selected Tab
    document.querySelector(`#${tabName}`).style.display="block";  

    // Highlight the selected tab
    let tablinks = document.querySelectorAll(".tablinks");

    tablinks.forEach((tablink)=>{
        tablink.classList.remove('active');
    });

    e.currentTarget.className += " active";
}

//=========================================================================================================
// getAllCrime()
// getAllCrime() takes latitude and longitude as input and retrieves relevant crime data
//
//=========================================================================================================

function getAllCrime() {

    let policeURL = `https://data.police.uk/api/crimes-street/${crimeCategories[0]}?lat=${userLat}&lng=${userLong}`;

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


    
    
//=========================================================================================================
// getAntiSocialBehaviour()
// getAntiSocialBehaviour() takes latitude and longitude as input and retrieves relevant crime data
//
//=========================================================================================================

function getAntiSocialBehaviour() {

    let policeURL = `https://data.police.uk/api/crimes-street/${crimeCategories[1]}?lat=${userLat}&lng=${userLong}`;

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
            
            antiSocialBehaviourTotal = body.length;
            
        }
    )
    .catch(
        (error) => {console.log(error);}
    );

}


//=========================================================================================================
// getBicycleTheft()
// getBicycleTheft() takes latitude and longitude as input and retrieves relevant crime data
//
//=========================================================================================================

function getBicycleTheft() {

    let policeURL = `https://data.police.uk/api/crimes-street/${crimeCategories[2]}?lat=${userLat}&lng=${userLong}`;

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
            
            bicycleTheftTotal = body.length;
            
        }
    )
    .catch(
        (error) => {console.log(error);}
    );

}


//=========================================================================================================
// getBurglary()
// getBurglary() takes latitude and longitude as input and retrieves relevant crime data
//
//=========================================================================================================

function getBurglary() {

    let policeURL = `https://data.police.uk/api/crimes-street/${crimeCategories[3]}?lat=${userLat}&lng=${userLong}`;

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
            
            burglaryTotal = body.length;
            
        }
    )
    .catch(
        (error) => {console.log(error);}
    );

}


//=========================================================================================================
// getCriminalDamageArson()
// getCriminalDamageArson() takes latitude and longitude as input and retrieves relevant crime data
//
//=========================================================================================================

function getCriminalDamageArson() {

    let policeURL = `https://data.police.uk/api/crimes-street/${crimeCategories[4]}?lat=${userLat}&lng=${userLong}`;

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
            
            criminalDamageArsonTotal = body.length;
            
        }
    )
    .catch(
        (error) => {console.log(error);}
    );

}


//=========================================================================================================
// getDrugs()
// getDrugs() takes latitude and longitude as input and retrieves relevant crime data
//
//=========================================================================================================

function getDrugs() {

    let policeURL = `https://data.police.uk/api/crimes-street/${crimeCategories[5]}?lat=${userLat}&lng=${userLong}`;

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
            
            drugsTotal = body.length;
            
        }
    )
    .catch(
        (error) => {console.log(error);}
    );

}

//=========================================================================================================
// getOtherTheft()
// getOtherTheft() takes latitude and longitude as input and retrieves relevant crime data
//
//=========================================================================================================

function getOtherTheft() {

    let policeURL = `https://data.police.uk/api/crimes-street/${crimeCategories[6]}?lat=${userLat}&lng=${userLong}`;

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
            
            otherTheftTotal = body.length;
            
        }
    )
    .catch(
        (error) => {console.log(error);}
    );

}


//=========================================================================================================
// getPossessionOfWeapons()
// getPossessionOfWeapons() takes latitude and longitude as input and retrieves relevant crime data
//
//=========================================================================================================

function getPossessionOfWeapons() {

    let policeURL = `https://data.police.uk/api/crimes-street/${crimeCategories[7]}?lat=${userLat}&lng=${userLong}`;

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
            
            possessionOfWeaponsTotal = body.length;
            
        }
    )
    .catch(
        (error) => {console.log(error);}
    );

}



//=========================================================================================================
// getPublicOrder()
// getPublicOrder() takes latitude and longitude as input and retrieves relevant crime data
//
//=========================================================================================================

function getPublicOrder() {

    let policeURL = `https://data.police.uk/api/crimes-street/${crimeCategories[8]}?lat=${userLat}&lng=${userLong}`;

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
            
            publicOrderTotal = body.length;
            
        }
    )
    .catch(
        (error) => {console.log(error);}
    );

}


//=========================================================================================================
// getRobbery()
// getRobbery() takes latitude and longitude as input and retrieves relevant crime data
//
//=========================================================================================================

function getRobbery() {

    let policeURL = `https://data.police.uk/api/crimes-street/${crimeCategories[9]}?lat=${userLat}&lng=${userLong}`;

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
            
            robberyTotal = body.length;
            
        }
    )
    .catch(
        (error) => {console.log(error);}
    );

}


//=========================================================================================================
// getShoplifting()
// getShoplifting() takes latitude and longitude as input and retrieves relevant crime data
//
//=========================================================================================================

function getShoplifting() {

    let policeURL = `https://data.police.uk/api/crimes-street/${crimeCategories[10]}?lat=${userLat}&lng=${userLong}`;

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
            
            shopliftingTotal = body.length;
            
        }
    )
    .catch(
        (error) => {console.log(error);}
    );

}


//=========================================================================================================
// getTheftFromThePerson()
// getTheftFromThePerson() takes latitude and longitude as input and retrieves relevant crime data
//       NEED TO COME BACK AND CHECK THIS AGAIN, specifically: Access to fetch at 'https://data.police.uk/api/crimes-street/theft-from-the-person?lat=51.524816&lng=0.021286' from origin 'http://127.0.0.1:5500' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.
//=========================================================================================================

function getTheftFromThePerson() {

    let policeURL = `https://data.police.uk/api/crimes-street/${crimeCategories[11]}?lat=${userLat}&lng=${userLong}`;

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
            
            theftFromThePersonTotal = body.length;
            
        }
    )
    .catch(
        (error) => {console.log(error);}
    );

}


//=========================================================================================================
// getVehicleCrime()
// getVehicleCrime() takes latitude and longitude as input and retrieves relevant crime data
// NEED TO COME BACK AND CHECK THIS AGAIN, similar issue to previous one
//=========================================================================================================

function getVehicleCrime() {

    let policeURL = `https://data.police.uk/api/crimes-street/${crimeCategories[12]}?lat=${userLat}&lng=${userLong}`;

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
            
            vehicleCrimeTotal = body.length;
            
        }
    )
    .catch(
        (error) => {console.log(error);}
    );

}



//=========================================================================================================
// getViolentCrime()
// getViolentCrime() takes latitude and longitude as input and retrieves relevant crime data
// NEED TO COME BACK AND CHECK THIS AGAIN, similar issue to previous one
//=========================================================================================================

function getViolentCrime() {

    let policeURL = `https://data.police.uk/api/crimes-street/${crimeCategories[13]}?lat=${userLat}&lng=${userLong}`;

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
            
            violentCrimeTotal = body.length;
            
        }
    )
    .catch(
        (error) => {console.log(error);}
    );

}


//=========================================================================================================
// getOtherCrime()
// getOtherCrime() takes latitude and longitude as input and retrieves relevant crime data
// NEED TO COME BACK AND CHECK THIS AGAIN, similar issue to previous one
//=========================================================================================================

function getOtherCrime() {

    let policeURL = `https://data.police.uk/api/crimes-street/${crimeCategories[14]}?lat=${userLat}&lng=${userLong}`;

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
            
            otherCrimeTotal = body.length;
            
        }
    )
    .catch(
        (error) => {console.log(error);}
    );

}


//=========================================================================================================
// fillInTable()
// fillInTable() retrieves the relevant crime data totals and writes them into the table
//=========================================================================================================

function fillInTable() {

        document.querySelectorAll(".cat")[0].innerHTML = crimeCategoriesNames[0];
        document.querySelectorAll(".catValue")[0].innerHTML = allCrimeTotal;

        document.querySelectorAll(".cat")[1].innerHTML = crimeCategoriesNames[1];
        document.querySelectorAll(".catValue")[1].innerHTML = antiSocialBehaviourTotal;

        document.querySelectorAll(".cat")[2].innerHTML = crimeCategoriesNames[2];
        document.querySelectorAll(".catValue")[2].innerHTML = bicycleTheftTotal;

        document.querySelectorAll(".cat")[3].innerHTML = crimeCategoriesNames[3];
        document.querySelectorAll(".catValue")[3].innerHTML = burglaryTotal;

        document.querySelectorAll(".cat")[4].innerHTML = crimeCategoriesNames[4];
        document.querySelectorAll(".catValue")[4].innerHTML = criminalDamageArsonTotal;

        document.querySelectorAll(".cat")[5].innerHTML = crimeCategoriesNames[5];
        document.querySelectorAll(".catValue")[5].innerHTML = drugsTotal;

        document.querySelectorAll(".cat")[6].innerHTML = crimeCategoriesNames[6];
        document.querySelectorAll(".catValue")[6].innerHTML = otherTheftTotal;

        document.querySelectorAll(".cat")[7].innerHTML = crimeCategoriesNames[7];
        document.querySelectorAll(".catValue")[7].innerHTML = possessionOfWeaponsTotal;

        document.querySelectorAll(".cat")[8].innerHTML = crimeCategoriesNames[8];
        document.querySelectorAll(".catValue")[8].innerHTML = publicOrderTotal;

        document.querySelectorAll(".cat")[9].innerHTML = crimeCategoriesNames[9];
        document.querySelectorAll(".catValue")[9].innerHTML = robberyTotal;

        document.querySelectorAll(".cat")[10].innerHTML = crimeCategoriesNames[10];
        document.querySelectorAll(".catValue")[10].innerHTML = shopliftingTotal;

        document.querySelectorAll(".cat")[11].innerHTML = crimeCategoriesNames[11];
        document.querySelectorAll(".catValue")[11].innerHTML = theftFromThePersonTotal;

        document.querySelectorAll(".cat")[12].innerHTML = crimeCategoriesNames[12];
        document.querySelectorAll(".catValue")[12].innerHTML = vehicleCrimeTotal;

        document.querySelectorAll(".cat")[13].innerHTML = crimeCategoriesNames[13];
        document.querySelectorAll(".catValue")[13].innerHTML = violentCrimeTotal;

        document.querySelectorAll(".cat")[14].innerHTML = crimeCategoriesNames[14];
        document.querySelectorAll(".catValue")[14].innerHTML = otherCrimeTotal;

}


//=========================================================================================================
//                                     Handling the checkboxes
//=========================================================================================================
  
const secondForm = document.querySelector(".userChosenCategories");
let checkboxArray = document.querySelectorAll("[name=crimeCategory]");

secondForm.addEventListener("submit", (event) => {

    event.preventDefault();

    fillInTable();
    
    checkboxArray.forEach(hideFilteredCategories);


});

function hideFilteredCategories(value, index) {
    if(value.checked == true) {
        document.querySelectorAll(".cat")[index].style.display = "none";
        document.querySelectorAll(".catValue")[index].style.display = "none";
    }

}

//=========================================================================================================
// displayTab()
// 
//
//=========================================================================================================

function displayTab(e, tabName) {

    //Hide All Tabs
    document.querySelector("#summary-tab-content").style.display = "none";
    document.querySelector("#crime-tab-content").style.display = "none";


    //Show the Selected Tab
    document.querySelector(`#${tabName}`).style.display="block";  

    // Highlight the selected tab
    let tablinks = document.querySelectorAll(".tablinks");

    tablinks.forEach((tablink)=>{
        tablink.classList.remove('active');
    });

    e.currentTarget.className += " active";
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

