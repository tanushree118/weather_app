import React, { useState, useRef } from 'react';
import { TEMP_RELATION } from './constants';

export default function Weather() {
    const [weatherData, setWeatherData] = useState({});
    const [tempUnit, setTempUnit] = useState("Kelvin")
    let inputRef = useRef();

    const callWeatherAPI = async (cityName) => {
        let temp = TEMP_RELATION[tempUnit].name;
        console.log(temp, tempUnit, 'hello what the hell')
        try {
            let data = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=${temp}&appid={API_key}`);
            return data.json();
        } catch(err) {
            alert("Error thrown: ", err);
        }
    }

    const getFormattedDate = (timestamp) => {
        let date = new Date(timestamp * 1000);
        let hours = date.getHours();
        let minutes = date.getMinutes();
        if(hours > 12) {
            hours -= 12;
        }
        return hours + ':' + minutes;
    }

    const onCityClick = async () => {
        const cityName = inputRef.current.value || "";
        let weatherInfo = await callWeatherAPI(cityName); 
        if(weatherInfo.cod !== 200) {
            console.log(weatherInfo.message);
        } else {
            setWeatherData(weatherInfo);
        }
    }

    const handleTempUnitChange = (event) => {
        setTempUnit(event.target.value);
    }

    return (
        <>
            <div>
                <input type="text" id="location-name" ref={inputRef}/>
                <input type="button" id="location-button" onClick={onCityClick} value={"Click"}/>
            </div>
            <div>
                <label htmlFor="temp_unit">Choose temperature unit:</label>
                <select name="temp_unit" id="temp_unit">
                    {Object.keys(TEMP_RELATION).map((item, index) => {
                        // console.log(item, 'hello item')
                        return <option value={item} key={`temp_${index}`} onChange={(event) => handleTempUnitChange(event)}>{item}</option>
                    })}
                </select>
            </div>
            {Object.keys(weatherData).length > 0 ? 
            <div >
                <span>Temperature: {weatherData?.main?.temp}{TEMP_RELATION[tempUnit].label}</span>
                <span>Weather Description: {weatherData?.weather[0]?.description}</span>
                <span>Feels Like: {weatherData?.main?.feels_like}{TEMP_RELATION[tempUnit].label}</span>
                <span>Wind: {weatherData?.wind?.speed} {TEMP_RELATION[tempUnit].speed}</span>
                <span>Humidity: {weatherData?.main?.humidity}%</span>
                <span>Sunrise: {getFormattedDate(weatherData?.sys?.sunrise)} AM</span>
                <span>Sunset: {getFormattedDate(weatherData?.sys?.sunset)} PM</span>
            </div> : <div>Loading data...</div> }
        </>
    )
}