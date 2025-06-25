export async function getWeather() {
    const latitude = 43.817749;
    const longitude = -111.783011;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.OPEN_WEATHER_API_KEY}&units=imperial`;

    const response = await fetch(apiUrl, { cache: "no-store" });
    return response.json();
}
