/** Datasource represents an API, to be used as a Module. generates input for instrument */
export class Datasource {
  // two-part API url; a specific entity (e.g. sensor name) is added in between (setEntity())
  // final fetch call will be on (baseUrl + entity + pathEnd + [query parameters])
  url: { baseUrl: string; pathEnd: string };
  entity: string;
  dataVariable: string;

  constructor(url?: { baseUrl: string; pathEnd: string }, entity?: string) {
    if (url && (url.baseUrl.length > 0 || url.pathEnd.length > 0)) {
      this.url = url;
    } else {
      // use default API url (Newcastle Urban Observatory) if optional url was not passed
      this.url = {
        baseUrl: 'https://newcastle.urbanobservatory.ac.uk/api/v1.1/sensors',
        pathEnd: 'data/json/',
      };
    }
    if (entity) {
      this.entity = entity;
    } else {
      this.entity = 'PER_PEOPLE_NCLPILGRIMSTMARKETLN_FROM_SOUTH_TO_NORTH';
    }
    this.dataVariable = '';
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
    try {
      const firstPart = new URL(this.entity, this.url.baseUrl);
      const fullPath = new URL(this.url.pathEnd, firstPart);
      const queryParams = new URLSearchParams({
        starttime: dayFormatted,
        endtime: nextDayFormatted,
      });
      queryUrl = fullPath + '?' + queryParams;
    } catch (error) {
      console.log('ERROR: problem constructing query url - ' + error);
    }

    // fetch data
    try {
      const response = await fetch(queryUrl);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      console.log('Hurray: fetched data from ' + queryUrl);
      console.log(json);
    } catch (error) {
      console.log('ERROR: problem fetching data from API - ' + error);
    }
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
