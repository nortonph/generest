/** Datasource represents an API, to be used as a Module. generates input for instrument */
export class Datasource {
  // two-part API url; a specific entity (e.g. sensor name) is added in between (setEntity())
  // final fetch call will be on (baseUrl + entity + pathEnd + [query parameters])
  url: { baseUrl: string; pathEnd: string };
  entity: string;
  dataVariable: string; // for Newcastle Urban Observatory this is the sensor type (e.g. 'Weather' or 'Walking')
  rawDataFromApi: any; // holds raw (json) data pulled from API
  numberArray: number[]; // holds the extracted numerical data to be used for instrument sequence generation

  constructor(
    url?: { baseUrl: string; pathEnd: string },
    entity?: string,
    dataVariable?: string
  ) {
    if (url && (url.baseUrl.length > 0 || url.pathEnd.length > 0)) {
      this.url = url;
    } else {
      // use default API url (Newcastle Urban Observatory) if optional url was not passed
      this.url = {
        baseUrl: 'http://localhost:3000/api/nuo/api/v1.1/sensors/',
        pathEnd: '/data/json/',
      };
    }
    this.entity = entity
      ? entity
      : 'PER_PEOPLE_NCLPILGRIMSTMARKETLN_FROM_SOUTH_TO_NORTH';
    this.dataVariable = dataVariable ? dataVariable : 'Walking';
    this.numberArray = [];
  }

  /** Set the middle part of the query url (sensor name in Newcastle Urban Observatory) */
  setEntity(entity: string) {
    this.entity = entity;
  }

  /** Get a full day of sensor (entity) data from the Newcastle Urban Observatory */
  async getFullDay(date: Date) {
    // get the next day for query
    const nextDay = new Date(date.valueOf());
    nextDay.setDate(nextDay.getDate() + 1);
    // format dates into 'YYYYMMDD' for query
    const dayFormatted = this.#getDayFormatted(date);
    const nextDayFormatted = this.#getDayFormatted(nextDay);

    // construct query url from parts: baseUrl + entity + pathEnd + [query parameters]
    let queryUrl = '';
    let path: string;
    if (this.url.pathEnd.startsWith('/')) {
      path = this.entity + this.url.pathEnd;
    } else {
      path = this.entity + '/' + this.url.pathEnd;
    }
    try {
      const fullUrl = new URL(path, this.url.baseUrl).href;
      const queryParams = new URLSearchParams({
        starttime: dayFormatted,
        endtime: nextDayFormatted,
      });
      queryUrl = fullUrl + '?' + queryParams.toString();
    } catch (error) {
      console.log('ERROR: problem constructing query url - ', error);
    }

    // fetch data
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
      this.rawDataFromApi = json;
    } catch (error) {
      console.log('ERROR: problem fetching data from API: ', error);
    }

    // extract numbers from raw data
    try {
      this.extractNumberArrayFromRawData();
    } catch (error) {
      console.log('ERROR: problem extracting numberArray from data: ', error);
    }
  }

  extractNumberArrayFromRawData() {
    // todo: check for valid data
    const sensorData = this.rawDataFromApi.sensors[0].data[this.dataVariable];
    this.numberArray = [];
    for (let idx in sensorData) {
      this.numberArray.push(sensorData[idx].Value);
    }
    console.log('sensorData: ', sensorData);
    console.log('numberArray: ', this.numberArray);
  }

  /** Private method to get formatted day (YYYYMMDD) */
  #getDayFormatted(date: Date) {
    return (
      date.getFullYear().toString() +
      (date.getMonth() + 1).toString().padStart(2, '0') +
      date.getDate().toString().padStart(2, '0')
    );
  }
}
