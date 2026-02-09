console.log( 'test this' );

const url = 'https://api.weatherapi.com/v1/current.json?q=lisbon&key=e322e084992447e79a7232558260302';

async function getData() {
    const response = await fetch(url);
    const data = await response.json();
    console.log("json data from API", url) 

    const tempCelsius = data.current.temp_c;
    const location = data.location.name;
    console.log("It is " + tempCelsius + " in " + location)

}

getData();