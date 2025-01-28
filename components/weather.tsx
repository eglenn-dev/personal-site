import { use } from "react";
import Time from "./time";
import CurrentDate from "./date";

const weather = async () => {
    const latitude = 43.817749;
    const longitude = -111.783011;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=41b040317d7c966d88f7697cb552aba4&units=imperial`;

    const response = await fetch(apiUrl);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return response.json();
};

export default function WeatherCard() {
    const data = use(weather());
    return (
        <div className="card">
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
        <div className="card">
            <div className="cardHeader">
                <span>--</span>
                <span>
                    --/--/----
                    <br />
                    --:--
                </span>
            </div>
            <span className="temp">--°F</span>
            <div className="tempScale">
                <span>-------</span>
            </div>
        </div>
    );
}
