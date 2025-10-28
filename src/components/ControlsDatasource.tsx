/*  This component renders the module controls onto the 3d Shape
 */

import './Controls.css';
import { Html } from '@react-three/drei';
import { Datasource } from '../datasource';
import { DataService } from '../services/dataService';
import { useEffect, useState } from 'react';

interface ControlsDatasourceProps {
  datasource: Datasource;
  handleClose: () => void;
}

function ControlsDatasource(props: ControlsDatasourceProps) {
  const [sensorTypes, setSensorTypes] = useState<string[]>([]);
  const [sensorNames, setSensorNames] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState('<select sensor type>');
  const [selectedSensor, setSelectedSensor] = useState('<select sensor>');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataVar = await DataService.getDataVariables();
        setSensorTypes(dataVar);
      } catch (error) {
        console.log('ERROR fetching data for ControlsDatasource! ' + error);
      }
      try {
        const sensors = await DataService.getSensors(
          props.datasource.dataVariable
        );
        setSensorNames(sensors);
      } catch (error) {
        console.log('ERROR fetching data for ControlsDatasource! ' + error);
      }
    };
    // todo: set selected <input> option to the one in datasource.dataVariable (or set default here)
    fetchData().then(() => {
      console.log(sensorTypes)
      if (sensorTypes.includes('Walking')) {
        setSelectedType('Walking');
      } else {
        console.log(
          'Warning: default <Walking> not found in fetched sensor types'
        );
      }
    });
  }, []);

  const handleSelectType = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(event.target.value);
    props.datasource.setDataVariable(event.target.value);
    setSelectedSensor(event.target.value);
    // todo: update sensorNames here ->[3
  };

  const handleSelectSensor = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(event.target.value);
    props.datasource.setEntity(event.target.value);
    setSelectedSensor(event.target.value);
  };

  return (
    <Html className='controlsHtml'>
      <div className='controls'>
        <p>API</p>
        <div className='control'>
          <label htmlFor='type'>type: </label>
          <select
            id='type'
            name='type'
            value={selectedType}
            onChange={(event) => {
              handleSelectType(event);
            }}
          >
            {sensorTypes.length
              ? sensorTypes.map((dataVar) => {
                  return <option value={dataVar}>{dataVar}</option>;
                })
              : null}
          </select>
        </div>
        <div className='control'>
          <label htmlFor='sensor'>sensor: </label>
          <select
            id='sensor'
            name='sensor'
            value={selectedSensor}
            onChange={(event) => {
              handleSelectSensor(event);
            }}
          >
            {sensorNames.length
              ? sensorNames.map((sensors) => {
                  return <option value={sensors}>{sensors}</option>;
                })
              : null}
          </select>
        </div>
        <button onClick={props.handleClose} className='buttonClose'>
          close
        </button>
      </div>
    </Html>
  );
}

export default ControlsDatasource;
