// Service fetching sensor data from default public API (Newcastle Urban Observatory)

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
        return fetchedData;
    }
}
