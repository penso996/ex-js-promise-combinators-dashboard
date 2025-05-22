async function fetchJson(url) {
    const response = await fetch(url);
    const obj = await response.json();
    return obj;
}

async function getDashboardData(query) {
    try {
        const destinationsPromise = fetchJson(`http://localhost:3333/destinations?search=${query}`);
        const weathersPromise = fetchJson(`http://localhost:3333/weathers?search=${query}`);
        const airportsPromise = fetchJson(`http://localhost:3333/airports?search=${query}`);

        const promises = [destinationsPromise, weathersPromise, airportsPromise];
        const [destinations, weathers, airports] = await Promise.all(promises);

        return {
            city: destinations[0]?.name ?? null,
            country: destinations[0]?.country ?? null,
            temperature: weathers[0]?.temperature ?? null,
            weather: weathers[0]?.weather_description ?? null,
            airport: airports[0]?.name ?? null
        }
    } catch (error) {
        throw new Error("Errore nel recupero dei dati: " + (error.message))
    }
}

getDashboardData('vienna')
    .then(data => {
        console.log('Dasboard data:', data);
        let text = "";
        if (data.city && data.country) {
            text += `${data.city} is in ${data.country}.\n`
        }
        if (data.temperature && data.weather) {
            text += `Today there are ${data.temperature} degrees and the weather is ${data.weather}.\n`
        }
        if (data.airport) {
            text += `The main airport is ${data.airport}.\n`
        }
        console.log(text)
    })
    .catch(error => console.error(error));