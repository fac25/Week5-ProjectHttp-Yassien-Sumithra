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
                
                // display output contianer
                getOutputContainer();

                // Populate Summary tab
                getMap();
                getSummary(body);
                getNeighbour(postcode);

                // Populate Crime tab
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
// getOutputContainer()
// 
//
//=========================================================================================================

function getOutputContainer(){
    document.querySelector(".output").style.display = "block";
}

//=========================================================================================================
// getSummary()
// 
//
//=========================================================================================================

function getSummary(data){
    
    let summaryTable = document.querySelector("#summary-table");
    let tbody = summaryTable.querySelector("tbody");

    appendRow(tbody, "Local Authority", data.result.admin_district);
    appendRow(tbody, "Ward", data.result.admin_ward);
    appendRow(tbody, "Constituency", data.result.parliamentary_constituency);
    appendRow(tbody, "Region", data.result.region);
    appendRow(tbody, "Country", data.result.country);

}

//=========================================================================================================
// appendRow()
// 
//
//=========================================================================================================

function appendRow(a_tbody, a_dataElem1, a_dataElem2){

    const rowElement = document.createElement("tr");
    const dataElem1 = document.createElement("td"); 
    const dataElem2 = document.createElement("td");

    dataElem1.innerHTML =  a_dataElem1;
    dataElem2.innerHTML = a_dataElem2;

    rowElement.appendChild(dataElem1);
    rowElement.appendChild(dataElem2);

    a_tbody.appendChild(rowElement);
}

//=========================================================================================================
// getNeighbour()
// 
//
//=========================================================================================================

function getNeighbour(a_postcode){

    let neighbourUrl = `https://api.postcodes.io/postcodes/${a_postcode}/nearest`;

    fetch(neighbourUrl)

    .then((resp)=>{
        
        return resp.json();
    })
    .then((data)=>{
        console.log(data);
        console.log(data.result.length);
        let neighbourTable = document.querySelector("#neighbour-table");
        let tbody = neighbourTable.querySelector("tbody");

        const resultArr = data.result;
    
        for(let i=0; i< data.result.length; i++)
        {
            appendRow(tbody, resultArr[i].admin_district, resultArr[i].postcode);
        }

    })

}

//=========================================================================================================
// getAllCrime()
// getAllCrime() takes latitude and longitude as input and retrieves relevant crime data
//
//=========================================================================================================

function getAllCrime() {

    let policeURL = `https://guarded-sierra-03090.herokuapp.com/https://data.police.uk/api/crimes-street/${crimeCategories[0]}?lat=${userLat}&lng=${userLong}`;

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
    let policeDateURL = `https://guarded-sierra-03090.herokuapp.com/https://data.police.uk/api/crime-last-updated`;
    
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

    let policeURL = `https://guarded-sierra-03090.herokuapp.com/https://data.police.uk/api/crimes-street/${crimeCategories[1]}?lat=${userLat}&lng=${userLong}`;

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

    let policeURL = `https://guarded-sierra-03090.herokuapp.com/https://data.police.uk/api/crimes-street/${crimeCategories[2]}?lat=${userLat}&lng=${userLong}`;

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

    let policeURL = `https://guarded-sierra-03090.herokuapp.com/https://data.police.uk/api/crimes-street/${crimeCategories[3]}?lat=${userLat}&lng=${userLong}`;

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

    let policeURL = `https://guarded-sierra-03090.herokuapp.com/https://data.police.uk/api/crimes-street/${crimeCategories[4]}?lat=${userLat}&lng=${userLong}`;

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

    let policeURL = `https://guarded-sierra-03090.herokuapp.com/https://data.police.uk/api/crimes-street/${crimeCategories[5]}?lat=${userLat}&lng=${userLong}`;

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

    let policeURL = `https://guarded-sierra-03090.herokuapp.com/https://data.police.uk/api/crimes-street/${crimeCategories[6]}?lat=${userLat}&lng=${userLong}`;

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

    let policeURL = `https://guarded-sierra-03090.herokuapp.com/https://data.police.uk/api/crimes-street/${crimeCategories[7]}?lat=${userLat}&lng=${userLong}`;

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

    let policeURL = `https://guarded-sierra-03090.herokuapp.com/https://data.police.uk/api/crimes-street/${crimeCategories[8]}?lat=${userLat}&lng=${userLong}`;

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

    let policeURL = `https://guarded-sierra-03090.herokuapp.com/https://data.police.uk/api/crimes-street/${crimeCategories[9]}?lat=${userLat}&lng=${userLong}`;

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

    let policeURL = `https://guarded-sierra-03090.herokuapp.com/https://data.police.uk/api/crimes-street/${crimeCategories[10]}?lat=${userLat}&lng=${userLong}`;

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
//=========================================================================================================

function getTheftFromThePerson() {

    let policeURL = `https://guarded-sierra-03090.herokuapp.com/https://data.police.uk/api/crimes-street/${crimeCategories[11]}?lat=${userLat}&lng=${userLong}`;

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
// 
//=========================================================================================================

function getVehicleCrime() {

    let policeURL = `https://guarded-sierra-03090.herokuapp.com/https://data.police.uk/api/crimes-street/${crimeCategories[12]}?lat=${userLat}&lng=${userLong}`;

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
// 
//=========================================================================================================

function getViolentCrime() {

    let policeURL = `https://guarded-sierra-03090.herokuapp.com/https://data.police.uk/api/crimes-street/${crimeCategories[13]}?lat=${userLat}&lng=${userLong}`;

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
// 
//=========================================================================================================

function getOtherCrime() {

    let policeURL = `https://guarded-sierra-03090.herokuapp.com/https://data.police.uk/api/crimes-street/${crimeCategories[14]}?lat=${userLat}&lng=${userLong}`;

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
let noneCheckbox = document.querySelectorAll("[name=noneAll]")[0];

secondForm.addEventListener("submit", (event) => {

    event.preventDefault();
    
    fillInTable();
    checkboxArray.forEach(hideFilteredCategories);
    

});

function hideFilteredCategories(value, index) {
    if (noneCheckbox.checked == true) {}
    else if (value.checked == true) {
        document.querySelectorAll(".cat")[index].style.display = "none";
        document.querySelectorAll(".catValue")[index].style.display = "none";
    }

}
