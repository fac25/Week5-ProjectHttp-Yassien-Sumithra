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
function getPostcode(event){

    event.preventDefault();
        
    const postcode = document.querySelector("#postcode").value;
    //console.log(postcode); // For testing
        
}