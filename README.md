# Next.js Weather Application

## Project Description

This is a weather application built with Next.js that allows users to search for weather information by city name or use their current location. The application fetches weather data from the OpenWeatherMap API.

## Features

- City-based weather search
- Geolocation support for current location weather
- Responsive design using TailwindCSS

## Technologies Used

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [OpenWeatherMap API](https://openweathermap.org/api)

## Setup and Installation

### Prerequisites

- Node.js
- npm (Node Package Manager)
- OpenWeatherMap API key

### API Key Setup

1. Obtain a free API key from [OpenWeatherMap](https://openweathermap.org/).
2. Create a `.env.local` file in the project's root directory.
3. Add the following line to the file:
   `NEXT_PUBLIC_WEATHER_KEY=your_api_key_here`

Replace `your_api_key_here` with your actual API key.

Note: It may take up to 15 minutes for a new API key to become active.

### Installation

1. Clone the repository:

```bash
git clone git@github.com:nikitao13/weather-dashboard.git
cd weather-dashboard
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open http://localhost:3000 in your browser to view the application.

### Usage

Use the search bar to find weather information for a specific city.
Click on the location icon to use your browser's geolocation data for local weather information.

### Project Origin

This project was developed as part of a course from freeCodeCamp, focusing on Next.js, TypeScript, React, and TailwindCSS.

### Notes

If you encounter 404 errors immediately after setting up a new API key, wait for about 15 minutes and try again.
Ensure your browser allows location access if you want to use the geolocation feature.
