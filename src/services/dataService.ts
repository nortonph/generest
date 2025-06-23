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
    // todo: data model for this and others
    // todo: error handling
    const dataVariableNames: string[] = [];
    fetchedData.Variables.forEach((element: any) => {
      dataVariableNames.push(element.Name);
    });
    dataVariableNames.sort();
    DataService.cache.set('dataVariables', dataVariableNames);
    return dataVariableNames;
  }

  static async getSensors(dataVariable: string) {
    if (DataService.cache.has('sensors' + dataVariable)) {
      return DataService.cache.get('sensors' + dataVariable);
    }

    const sensorsUrl =
      DataService.baseUrl + 'json/?sensor_type=' + dataVariable;
    const fetchedData = await fetchData(sensorsUrl);
    // todo: data model for this and others
    // todo: error handling
    const sensorNames: string[] = [];
    console.log(fetchedData);
    fetchedData.sensors.forEach((element: any) => {
      sensorNames.push(element['Sensor Name']);
    });
    // sensorNames.sort();
    DataService.cache.set('sensors' + dataVariable, sensorNames);
    return sensorNames;
  }
}
