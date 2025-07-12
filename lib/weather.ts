export async function getWeather() {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${process.env.WEATHER_LAT}&lon=${process.env.WEATHER_LONG}&appid=${process.env.OPEN_WEATHER_API_KEY}&units=imperial`;

    const response = await fetch(apiUrl, { next: { revalidate: 900 } });
    return response.json();
}
