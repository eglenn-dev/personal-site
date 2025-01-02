import { use } from "react";
import styles from "./styles/weather.module.css";
import Time from "./time";

const weather = async () => {
    "use server";
    const latitude = 43.817749;
    const longitude = -111.783011;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=41b040317d7c966d88f7697cb552aba4&units=imperial`;

    const response = await fetch(apiUrl);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return response.json();
};

export default function WeatherCard() {
    const data = use(weather());
    const date = new Date();

    return (
        <div className={styles.card}>
            <div className={styles.container}>
                <div className={`${styles.cloud} ${styles.front}`}>
                    <span className={styles.leftFront} />
                    <span className={styles.rightFront} />
                </div>
                <span className={`${styles.sun} ${styles.sunshine}`} />
                <span className={styles.sun} />
                <div className={`${styles.cloud} ${styles.back}`}>
                    <span className={styles.leftBack} />
                    <span className={styles.rightBack} />
                </div>
            </div>
            <div className={styles.cardHeader}>
                <span>{data.name}</span>
                <span>
                    {date.getMonth() + 1}/{date.getDate()}/{date.getFullYear()}
                    <br />
                    <Time />
                </span>
            </div>
            <span className={styles.temp}>
                {data.main.temp.toString().split(".")[0]}°F
            </span>
            <div className={styles.tempScale}>
                <span>{data.weather[0].main}</span>
            </div>
        </div>
    );
}

export async function WeatherSkeleton() {
    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <span>--</span>
                <span>
                    --/--/----
                    <br />
                    --:--
                </span>
            </div>
            <span className={styles.temp}>--°F</span>
            <div className={styles.tempScale}>
                <span>-------</span>
            </div>
        </div>
    );
}
