// helper functions for fetching data from the public API

export async function fetchData(queryUrl: string) {
    try {
        console.log('trying to fetch with query url: ' + queryUrl);
        const response = await fetch(queryUrl, {
        mode: 'cors',
        method: 'GET',
        headers: {
            'content-type': 'application/json',
        },
        });
        if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
        console.log('Hurray: fetched data from ' + queryUrl);
        console.log(json);
        return json;
    } catch (error) {
        console.log('ERROR: problem fetching data from API: ', error);
        return null;
    }
}
