This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

You will need an OpenWeatherMap API key to fetch the weather data. This can be obtained for free from their website https://openweathermap.org. After obtaining your API key, copy it and create a new .env.local file in the projects root directory. Then add the line NEXT_PUBLIC_WEATHER_KEY=apikey replacing "apikey" with the key you just copied earlier. It may take up to 15mins~ before a fresh api key works, so if you are getting 404 errors at first just wait a little while and try again.

First, make sure to install dependencies:

```bash
npm run install
```

Then, start the dev environment:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Users can use the searchbar to find their city, or click on the location icon to use local geolocation data from the browser. 

This project was made as part of a course from myFreeCodeCamp teaching Nextjs, TypeScript, React, and TailwindCSS.
