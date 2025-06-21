// Service fetching sensor data from default public API (Newcastle Urban Observatory)
// https://newcastle.urbanobservatory.ac.uk/api_docs/doc/sensors-json/

import { fetchData } from '../helpers/fetch';

export class DataService {
    static cache = new Map();
    static baseUrl = 'http://localhost:3000/api/nuo/api/v1.1/sensors/';
    static dataPathEnd = '/data/json/';

    static async getDataVariables() {
        if (DataService.cache.has('dataVariables')) {
            return DataService.cache.get('dataVariables');
        }

        const dataVariablesUrl = DataService.baseUrl + 'types/json/';
        const fetchedData = await fetchData(dataVariablesUrl);
        DataService.cache.set('dataVariables', fetchData);
        return fetchedData;
    }

    static async getSensors(dataVariable: string) {
        if (DataService.cache.has('sensors' + dataVariable)) {
            return DataService.cache.get('sensors' + dataVariable);
        }

        const sensorsUrl = DataService.baseUrl + 'json/';
        const fetchedData = await fetchData(sensorsUrl);
        DataService.cache.set('sensors' + dataVariable, fetchData);
        return fetchedData;
    }
}
