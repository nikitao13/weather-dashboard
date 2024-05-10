'use client'
import Navbar from "@/components/Navbar";
import {useQuery} from "react-query";
import axios from "axios";
import {format, fromUnixTime, parseISO} from "date-fns";
import Container from "@/components/Container";
import {convertToCelcius} from "@/utils/convertToCelcius";
import WeatherIcon from "@/components/WeatherIcon";
import {dayOrNight} from "@/utils/dayOrNight";
import WeatherDetails from "@/components/WeatherDetails";
import {metersToKM} from "@/utils/metersToKm";
import {convertWindSpeed} from "@/utils/convertWindSpeed";
import ForecastDetails from "@/components/ForecastDetails";
import {useAtom} from "jotai";
import {loadingCityAtom, placeAtom} from "@/app/atom";
import {useEffect} from "react";

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_KEY

interface WeatherData {
    cod: string;
    message: number;
    cnt: number;
    list: WeatherEntry[];
    city: CityInfo;
}

interface WeatherEntry {
    dt: number;
    main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        sea_level: number;
        grnd_level: number;
        humidity: number;
        temp_kf: number;
    };
    weather: Weather[];
    clouds: {
        all: number;
    };
    wind: {
        speed: number;
        deg: number;
        gust: number;
    };
    visibility: number;
    pop: number;
    rain?: {
        "3h": number;
    };
    sys: {
        pod: string;
    };
    dt_txt: string;
}

interface Weather {
    id: number;
    main: string;
    description: string;
    icon: string;
}

interface CityInfo {
    id: number;
    name: string;
    coord: {
        lat: number;
        lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
}

export default function Home() {
    const [place, setPlace] = useAtom(placeAtom);
    const [loading, setLoading] = useAtom(loadingCityAtom)

    const { isLoading, error, data, refetch } = useQuery<WeatherData>('repoData', async() => {
            const {data} = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${API_KEY}&cnt=56`);
            return data;
        }
    );

    useEffect(() => {
        refetch();
    }, [place, refetch]);

    const firstData = data?.list[0];

    const uniqueDates = [
        ...new Set(
            data?.list.map(
            (entry) => new Date(entry.dt *  1000).toISOString().split("T")[0]
            )
        )
    ];

    const firstDataForEachDate = uniqueDates.map((date) => {
        return data?.list.find((entry) => {
            const entryDate = new Date(entry.dt * 1000).toISOString().split("T")[0];
            const entryTime = new Date(entry.dt * 1000).getHours();
            return entryDate === date && entryTime >= 6;
        });
    });

    if (isLoading)
        return (
            <div className="flex items-center min-h-screen justify-center">
              <p className="animate-bounce">Loading...</p>
            </div>
    );

  return (
      <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
        <Navbar location={data?.city.name} />
        <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
            {loading ? <SkeletonLoading /> :
            <>
            <section className="space-y-4">
                <div className="space-y-2">
                    <h2 className="flex gap-1 text-2xl items-end">
                        <p>{format(parseISO(firstData?.dt_txt ??''), "EEEE")}</p>
                        <p className="text-lg">({format(parseISO(firstData?.dt_txt ??''), "dd.MM.yyyy")})</p>
                    </h2>
                    <Container className="gap-10 px-6 items-center">
                        <div className="flex flex-col px-4">
                            <span className="text-5xl">
                                {convertToCelcius(firstData?.main.temp ?? 0)}°
                            </span>
                            <p className="text-xs space-x-1 whitespace-nowrap">
                                <span>Feels like</span>
                                <span>
                                    {convertToCelcius(firstData?.main.feels_like ?? 0)}°
                                </span>
                            </p>
                            <p className="text-xs space-x-2">
                                <span>
                                    {convertToCelcius(firstData?.main.temp_min ?? 0)}°↓
                                </span>
                                <span>
                                    {convertToCelcius(firstData?.main.temp_max ?? 0)}°↑
                                </span>
                            </p>
                        </div>
                        <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between">
                            {data?.list.map((d, i) =>
                                <div
                                    key={i}
                                    className="flex flex-col justify-between gap-2 items-center text-xs font-semibold"
                                >
                                    <p className="whitespace-nowrap">
                                        {format(parseISO(d.dt_txt), "h:mm a")}
                                    </p>
                                    <WeatherIcon iconName={dayOrNight(d.weather[0].icon, d.dt_txt)} />

                                    <p>{convertToCelcius(d?.main.temp ?? 0)}°</p>
                                </div>
                            )}
                        </div>
                    </Container>
                </div>
                <div className="flex gap-4">
                    <Container className="w-fit justify-center flex-col px-4 items-center">
                        <p className="capitalize text-center">{firstData?.weather[0].description}</p>
                        <WeatherIcon iconName={dayOrNight(
                            firstData?.weather[0].icon ?? "",
                            firstData?.dt_txt ?? ""
                        )} />
                    </Container>
                    <Container className="bg-yellow-300/80 px-6 gap-4 justify-between overflow-x-auto">
                        <WeatherDetails
                            visibility={metersToKM(firstData?.visibility ?? 25000)}
                            humidity={`${firstData?.main.humidity ?? 61}%`}
                            windSpeed={convertWindSpeed(firstData?.wind.speed ?? 1.64)}
                            airPressure={`${firstData?.main.pressure ?? 1012} hPa`}
                            sunrise={format(fromUnixTime(data?.city.sunrise ?? 1702949452), "H:mm")}
                            sunset={format(fromUnixTime(data?.city.sunset ?? 1702517657), "H:mm")}
                        />
                    </Container>
                </div>
            </section>

            <section className="flex w-full flex-col gap-4">
                <p className="text-2xl">Forecast (7 Days)</p>
                {firstDataForEachDate.map((d, i) => (
                    <ForecastDetails
                        key={i}
                        description={d?.weather[0].description ?? ""}
                        weatherIcon={d?.weather[0].icon ?? "01d"}
                        date={format(parseISO(d?.dt_txt ?? ""), "dd.MM")}
                        day={format(parseISO(d?.dt_txt ?? ""), "EEEE")}
                        feels_like={d?.main.feels_like ?? 0}
                        temp={d?.main.temp ?? 0}
                        temp_max={d?.main.temp_max ?? 0}
                        temp_min={d?.main.temp_min ?? 0}
                        airPressure={`${d?.main.pressure} hPa`}
                        humidity={`${d?.main.humidity}%`}
                        sunrise={format(fromUnixTime(data?.city.sunrise ?? 1702949452), "H:mm")}
                        sunset={format(fromUnixTime(data?.city.sunset ?? 1702517657), "H:mm")}
                        visibility={metersToKM(d?.visibility ?? 25000)}
                        windSpeed={convertWindSpeed(d?.wind.speed ?? 1.64)}
                    />
                ))}
            </section>
            </>}
        </main>
      </div>
  )
}

function SkeletonLoading() {
    return (
        <div className="animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/5 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/6 mb-2"></div>
        </div>
    );
}
