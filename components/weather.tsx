import Time from "./time";
import CurrentDate from "./date";

async function getWeather() {
    const latitude = 43.817749;
    const longitude = -111.783011;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.OPEN_WEATHER_API_KEY}&units=imperial`;

    const response = await fetch(apiUrl, { cache: "no-store" });
    return response.json();
}

export default async function WeatherCard() {
    let data;
    let isNight = false;

    try {
        data = await getWeather();
        const sunrise = new Date(data.sys.sunrise * 1000);
        const sunset = new Date(data.sys.sunset * 1000);
        const currentTime = new Date();
        isNight = currentTime < sunrise || currentTime > sunset;
    } catch (error) {
        console.log("Failed to fetch weather data:", error);
        data = {
            name: "Unknown",
            main: { temp: 0 },
            weather: [{ main: "Unknown" }],
            sys: { sunrise: 0, sunset: 0 },
        };
    }

    return (
        <div className="card">
            <div className="container">
                <div className="cloud front">
                    <span className="leftFront" />
                    <span className="rightFront" />
                </div>
                {isNight ? (
                    <>
                        <span className="moon moonlight" />
                        <span className="moon" />
                    </>
                ) : (
                    <>
                        <span className="sun sunshine" />
                        <span className="sun" />
                    </>
                )}
                <div className="cloud back">
                    <span className="leftBack" />
                    <span className="rightBack" />
                </div>
            </div>
            <div className="cardHeader">
                <span>{data.name}</span>
                <span>
                    <CurrentDate />
                    <br />
                    <Time />
                </span>
            </div>
            <span className="temp">
                {data.main.temp.toString().split(".")[0]}°F
            </span>
            <div className="tempScale">
                <span>{data.weather[0].main}</span>
            </div>
        </div>
    );
}

export async function WeatherSkeleton() {
    return (
        <div className="card animate-pulse">
            <div className="container">
                <div className="cloud front">
                    <span className="leftFront" />
                    <span className="rightFront" />
                </div>
                <span className="sun sunshine" />
                <span className="sun" />
                <div className="cloud back">
                    <span className="leftBack" />
                    <span className="rightBack" />
                </div>
            </div>
            <div className="cardHeader">
                <span>----</span>
                <span>
                    --/--/----
                    <br />
                    --:--:--
                </span>
            </div>
            <span className="temp">--°F</span>
            <div className="tempScale">
                <span>----</span>
            </div>
        </div>
    );
}
