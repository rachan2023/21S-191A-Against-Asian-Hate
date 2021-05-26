const map = L.map('map').setView([34.0709, -118.444], 5);

let CartoDB_Positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 19
});

CartoDB_Positron.addTo(map)
// create a new global scoped variable called 'scroller'
// you can think of this like the "map" with leaflet (i.e. const map = L.map('map'))
// let scroller = scrollama();

//marker cluster group 
let mcg = L.markerClusterGroup({
    spiderfyOnMaxZoom: false,
	showCoverageOnHover: true,
	zoomToBoundsOnClick: true
}); 
// under59, sixtyfour, sixtynine, overseventy
let under59 = L.featureGroup.subGroup(mcg);
let sixtyfour= L.featureGroup.subGroup(mcg);
let sixtynine = L.featureGroup.subGroup(mcg);
let overseventy = L.featureGroup.subGroup(mcg);

let url = "https://spreadsheets.google.com/feeds/list/1S2rdXU_e0T-APmkcVG8Vjm7XB4og7CUjszqNqqztI14/od6/public/values?alt=json"
fetch(url)
	.then(response => {
		return response.json();
		})
    .then(data =>{
                // console.log(data)
                formatData(data)
        }
)

let circleOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
}

let myFieldArray = []

function getDistinctValues(targetField){
    // find out how to add distinct values to an array 

    if (!myFieldArray.includes(targetField)){
        myFieldArray.push(targetField)
    } 
    return targetField
      // append values to array 
}


function addMarker(data){
        let zip = data.zipcode
        let city = data.whatcitydoyouorthepersonyouarerepresentingcurrentlylivein
        let age = data.howoldareyouorthepersonyouarerepresenting
        createButtons(data.lat,data.lng,city)
        getDistinctValues(age)
        console.log('all the distinct fields')
        console.log(myFieldArray)
        colorArray = ['green','blue','red','purple']
        circleOptions.fillColor = colorArray[myFieldArray.indexOf(age)]
        console.log("age")
        console.log(age)
        if (age == "under 59"){         
            
            under59.addLayer(L.circleMarker([data.lat,data.lng],circleOptions).bindPopup(`<h2> ${city }</h2> <h4> ${zip} </h4>`))
            return data.timestamp
        }
        else if (age == "60-64") {
            sixtyfour.addLayer(L.circleMarker([data.lat,data.lng],circleOptions).bindPopup(`<h2>${city}</h2><h4> ${zip} </h4> `))
        }
        else if (age == "65-69") {
            sixtynine.addLayer(L.circleMarker([data.lat,data.lng],circleOptions).bindPopup(`<h2>${city}</h2><h4> ${zip} </h4>`))
        }
        else {
            overseventy.addLayer(L.circleMarker([data.lat,data.lng],circleOptions).bindPopup(`<h2>${city}</h2><h4> ${zip} </h4> `))
        }
       
        return data   
}

function createButtons(lat,lng,anything){
    const newButton = document.createElement("button"); // adds a new button
    newButton.id = "button"+anything; // gives the button a unique id
    newButton.innerHTML = anything; // gives the button a title
    // newButton.setAttribute("class","step") // add the class called "step" to the button or div
    // newButton.setAttribute("data-step",newButton.id) // add a data-step for the button id to know which step we are on
    newButton.setAttribute("lat",lat); // sets the latitude 
    newButton.setAttribute("lng",lng); // sets the longitude 
    newButton.addEventListener('click', function(){
        map.flyTo([lat,lng], 10); //this is the flyTo from Leaflet
    })
    const spaceForButtons = document.getElementById('contents')
    spaceForButtons.appendChild(newButton);//this adds the button to our page.
}

let allLayers;
let testLayer;

function formatData(theData){
        const formattedData = [] /* this array will eventually be populated with the contents of the spreadsheet's rows */
        const rows = theData.feed.entry
        for(const row of rows) {
          const formattedRow = {}
          for(const key in row) {
            if(key.startsWith("gsx$")) {
                  formattedRow[key.replace("gsx$", "")] = row[key].$t
            }
          }
          formattedData.push(formattedRow)
        }
        console.log(formattedData)
        formattedData.forEach(addMarker)    
        testLayer = overseventy;
        allLayers = L.featureGroup([under59, sixtyfour, sixtynine, overseventy]);
        mcg.addTo(map)
        // console.log(allLayers)
        allLayers.addTo(map)
        map.fitBounds(allLayers.getBounds()); 
        startModal()
        document.getElementById("myBtn").click() // simulate click to start modal
        // setup the instance, pass callback functions
        // use the scrollama scroller variable to set it up
        // scroller
        // .setup({
        //     step: ".step", // this is the name of the class that we are using to step into, it is called "step", not very original
        // })
        // // do something when you enter a "step":
        // .onStepEnter((response) => {
        //     // you can access these objects: { element, index, direction }
        //     // use the function to use element attributes of the button 
        //     // it contains the lat/lng: 
        //     scrollStepper(response.element.attributes)
        // })
        // .onStepExit((response) => {
        //     // { element, index, direction }
        //     // left this in case you want something to happen when someone
        //     // steps out of a div to know what story they are on.
        // });
}
// function scrollStepper(thisStep){
//     // optional: console log the step data attributes:
//     // console.log("you are in thisStep: "+thisStep)
//     let thisLat = thisStep.lat.value
//     let thisLng = thisStep.lng.value
//     // tell the map to fly to this step's lat/lng pair:
//     map.flyTo([thisLat,thisLng])
// }
let layers = {

	'<i style="background: green; border-radius: 50%;"></i> Under 59 yrs old ': under59,
	'<i style="background: red; border-radius: 50%;"></i> 60-64 yrs old': sixtyfour,
    '<i style="background: purple; border-radius: 50%;"></i>65-69 yrs old': sixtynine,
	'<i style="background: blue; border-radius: 50%;"></i> Over 70 yrs old': overseventy
}

L.control.layers(null,layers,{collapsed: false}).addTo(map)


function startModal(){

    var modal = document.getElementById("myModal");

    // Get the button that opens the modal
    var btn = document.getElementById("myBtn");
    
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];
    
    // // When the user clicks the button, open the modal 
    // btn.onclick = function() {
    //   modal.style.display = "block";
    // }
    document.getElementById("myBtn").onclick = function() {
        modal.style.display = "block";};
    
    document.getElementById("turnOff59").onclick = function() {
        if (map.hasLayer(under59)){
            map.removeLayer(under59)

        }
        else{
            map.addLayer(under59)
        }
    }
    
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
      modal.style.display = "none";
    }
    
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
}
// setup resize event for scrollama incase someone wants to resize the page...
// window.addEventListener("resize", scroller.resize);