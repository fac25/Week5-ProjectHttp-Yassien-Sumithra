
//=========================================================================================================
// Global Variables
// 
//
//=========================================================================================================


// Object to store crime category and number of crimes committed - retrieved from API
const crimeCategoryObj_G = {
    'all-crime' : 0,
    'anti-social-behaviour' : 0,
    'bicycle-theft' : 0,
    'burglary' : 0,
    'criminal-damage-arson' : 0,
    'drugs' : 0,
    'other-theft' : 0,
    'possession-of-weapons' : 0,
    'public-order' : 0,
    'robbery' : 0,
    'shoplifting' : 0,
    'theft-from-the-person' : 0,
    'vehicle-crime' : 0,
    'violent crime' : 0,
    'other-crime' : 0
}; 


const months = [`January`, `February`, `March`, `April`, `May`, `June`, `July`,
`August`, `September`, `October`, `November`, `December`];



//=========================================================================================================
// Initialization
// Setting up a load handler to do the main startup work once the page is fully loaded.
//
//=========================================================================================================

window.addEventListener("load", startup, false);

function startup() {

    document.querySelector(".form-postcode").addEventListener("submit",getPostcode);

    // Add Event listener for the crime tab filters form     
    document.querySelector(".userChosenCategories").addEventListener("submit", filterCrime);

}

//=========================================================================================================
// getPostcode()
// Get the postcode from the user
//
//=========================================================================================================

function getPostcode(event){

    event.preventDefault();
        
    let postcode = document.querySelector("#postcode").value;
    console.log(postcode); // For testing


    const postCodeURL = `https://api.postcodes.io/postcodes/${postcode}`;

    fetch(postCodeURL)
    .then(
        (response) => {
            if (response.ok === false) {console.log(`Error, response status is ${response.status}`);}
            else {return response.json();}
        }
    )
    .then(
        (data) => {
                console.log(data); // For debug purpose
                
                // make latitude and longitude local
                let latitude = data.result.latitude;
                let longitude = data.result.longitude;

                // display output contianer
                getOutputContainer();

                // Populate Summary tab
                getMap(latitude, longitude);
                getSummary(data);
                getNeighbour(postcode);

                // Populate Crime tab
                getPoliceApiDate();
                
                // update all the crime numbers in crimeObj
                getCrimeData(latitude, longitude);

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

function getMap(a_latitude, a_longitude){

    var map = L.map('map').setView([a_latitude, a_longitude], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    var marker = L.marker([a_latitude, a_longitude]).addTo(map);

    var circle = L.circle([a_latitude, a_longitude], {
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
            if (response.ok === false) {console.Error(`Error, response status is ${response.status}`);}
            else {return response.json();}
        }
    )
    .then(
        (body) => {
            // console.log(body);
            // console.log(body.date);
            // console.log(body.date[5]);
            // console.log(body.date[6]);
            dateForWhichPoliceApiSearchResultsApply = `${body.date[5]}${body.date[6]}`
            // console.log(dateForWhichPoliceApiSearchResultsApply);

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
// getCrimeData()
// getCrimeData() takes latitude, longitude and extract the crime data for 'all-crime'.
// From the data make new object with different crime category and number of crimes per category
//
//=========================================================================================================

function getCrimeData(a_latitude, a_longitude) {

    let crimeCategory = 'all-crime';

    let policeURL = `https://data.police.uk/api/crimes-street/${crimeCategory}?lat=${a_latitude}&lng=${a_longitude}`;

    fetch(policeURL)
    .then(
        (response) => {
            if (response.ok === false) {console.error(`Error, response status is ${response.status}`);}
            else {return response.json();}
        }
    )
    .then(
        (data) => {

            // For debug purpose
            // console.log("============Crime data ============");
            // console.log(data);

            // For all data, extract the category properties into new array
            const crimeCategoryArr = data.map((item, index, arr) => {
                return item.category;
            });

            // find number of crimes committed per category and updated the crimeCategoryObj_G
            crimeCategoryArr.forEach(function (x) { crimeCategoryObj_G[x] = (crimeCategoryObj_G[x] || 0) + 1; });

            // Update 'All crime' in global object
            crimeCategoryObj_G['all-crime'] = data.length;

            // Update Crime Table
            updateCrimeTable(crimeCategoryObj_G);
        }
    )
    .catch((err) => {console.error(err);});

}

 //=========================================================================================================
// updateCrimeTable
// Update crime information in the crime table.
// It takes the crimeCategory Object{'crime catrgory' : number of crimes committed}
//
//=========================================================================================================
function updateCrimeTable(a_crimeCategoryObj){
    let crimeTable = document.querySelector("#crime-table");
    let tbody = crimeTable.querySelector("tbody");

    // Clear the table before making new one
    tbody.innerHTML = " ";

    for (const property in a_crimeCategoryObj) {
        appendRow(tbody, property, a_crimeCategoryObj[property]);
    }

}

//=========================================================================================================
// filterCrime
// Get the checkboxes that are checked filter and update the crime table
//
//=========================================================================================================

function filterCrime(e){
    e.preventDefault();
    
    // toggle between all-crime and rest of the crime categories checkboxes
    toggleAllCrime();

    // get the checkboxes which are checked
    let checkboxes = document.querySelectorAll('input[name="crimeCategory"]:checked');

    let filterCategory = {...crimeCategoryObj_G};

    checkboxes.forEach((checkbox) => {
        delete filterCategory[checkbox.value];
    });

    // update the crime table
    let isAllCrimeChecked = document.getElementById('allCrime').checked;

    (isAllCrimeChecked) ? updateCrimeTable(crimeCategoryObj_G) : updateCrimeTable(filterCategory);

}

//=========================================================================================================
// toggleAllCrime
// This will toggle the allcrime checkbox, if any other option is selected
//
//=========================================================================================================

function toggleAllCrime(){

    let groupCheck = Array.from(document.getElementsByName('crimeCategory'));
    let sepCheck = document.getElementById('allCrime');

    groupCheck.forEach(element => {
        element.onchange = () => {
            if (element.checked) {
                sepCheck.checked = false;
            }
        }
    });

    sepCheck.onchange = () => {
        if (sepCheck.checked) {
            groupCheck.forEach(element => {
                element.checked = false;
            })
        }
    }

}    
    