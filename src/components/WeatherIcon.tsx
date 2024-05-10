import React from 'react';
import Image from 'next/image';
import {cn} from "@/utils/cn";

interface WeatherIconProps {
    iconName: string;
    className?: string;
}

export default function WeatherIcon(props: WeatherIconProps) {
    return (
        <div className={cn('relative h-20 w-20', props.className)}>
            <Image
                width={100}
                height={100}
                alt="weather-icon"
                className="absolute h-full w-full"
                src={`https://openweathermap.org/img/wn/${props.iconName}@4x.png`}
                priority
            />
        </div>
    )
}