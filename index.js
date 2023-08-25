// fetch data
const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");


// intial variables need
let oldTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
oldTab.classList.add("current-tab");
getfromSessionStorage();


//for switch tab
function switchTab(newTab)
{
    // if want to switch on other tab
    if(newTab != oldTab)
    {
        // remove color
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");

        //finding we are on which tab

        //means new tab (we are on YourWeather Tab)
        //(and switch to SeachWeather Tab)
        if(!searchForm.classList.contains("active"))
        {
            //remove active from Your weather tab
            userInfoContainer.classList.remove("active");

            //remove active from grant tab
            grantAccessContainer.classList.remove("active");

            //add active in search tab
            searchForm.classList.add("active");
        }

        //means new tab (we are on SearchWeather Tab)
        //(and switch to YourWeather Tab)
        else
        {
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");

            // check we give grant access or not
            getfromSessionStorage();
        }
    }
}



// Event Listners

// for tab switch when click YourWeather Tab
userTab.addEventListener('click', () => {

    // pass click tab as input parameter
    switchTab(userTab);
})

// for tab switch when click searchTab
searchTab.addEventListener('click', () => {

    // pass click tab as input parameter
    switchTab(searchTab);
})


// check you give permission to grant Acces or not 
function getfromSessionStorage()
{
    const localCoordinates = sessionStorage.getItem("user-coordinates");

    // not give
    if(!localCoordinates)
    {
        grantAccessContainer.classList.add("active");
    }

    // already give
    else
    {
        // convert in JSON format
        const coordinates = JSON.parse(localCoordinates);

        fetchUserWeatherInfo(coordinates);
    }
}

async function  fetchUserWeatherInfo(coordinates)
{
    const {lat,lon} = coordinates;

    // make grant container invisible
    grantAccessContainer.classList.remove("active");

    // make loading visible
    loadingScreen.classList.add("active");

    // API call
    try {

        // store data in response
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          );

        // convert in JSON
        const  data = await response.json();

        // remove loading screen
        loadingScreen.classList.remove("active");

        // show YourWeather UI
        userInfoContainer.classList.add("active");

        // function used to enter values on UI
        renderWeatherInfo(data);    
    } 
    catch (err) {
        loadingScreen.classList.remove("active"); 
    }
}


function renderWeatherInfo(weatherInfo)
{
    //fistly, we have to fetch the elements 

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    //fetch values from weatherINfo object and put in UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = weatherInfo?.main?.temp;
    windspeed.innertext = weatherInfo?.wind?.speed;
    humidity.innertext = weatherInfo?.main?.humidity;
    cloudiness.innerText = weatherInfo?.clouds?.all;
}

// to search location if Your weather Info Not stored
function getLocation() 
{
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        //HW - show an alert for no gelolocation support available
    }
}

function showPosition(position) 
{

    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

}

// event listner to when click on grant Access
const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else 
        fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city) 
{
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        //hW
    }
}