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
        const [destinationsResult, weathersResult, airportsResult] = await Promise.allSettled(promises);

        const data = {};

        if (destinationsResult.status === "rejected") {
            console.error("Problema in destinations: " + destinationsResult.reason);
            data.city = null;
            data.country = null;
        } else {
            const destination = destinationsResult.value[0];
            data.city = destination?.name ?? null;
            data.country = destination?.country ?? null;
        }


        if (weathersResult.status === "rejected") {
            console.error("Problema in weathers: " + weathersResult.reason);
            data.temperature = null;
            data.weather = null;
        } else {
            const weather = weathersResult.value[0];
            data.temperature = weather?.temperature ?? null;
            data.weather = weather?.weather_description ?? null;
        }


        if (airportsResult.status === "rejected") {
            console.error("Problema in airports: " + airportsResult.reason);
            data.airport = null;
        } else {
            const airport = airportsResult.value[0];
            data.airport = airport?.name ?? null;
        }

        return data;

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