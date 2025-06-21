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
  const [dataVariables, setDataVariables] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataVar = await DataService.getDataVariables();
        setDataVariables(dataVar);
      } catch (error) {
        console.log('ERROR fetching data for ControlsDatasource! ' + error);
      }
    };

    fetchData();
  }, []);

  const handleSelectType = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(event.target.value);
    props.datasource.setDataVariable(event.target.value);
  };

  const handleSelectSensor = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(event.target.value);
    props.datasource.setEntity(event.target.value);
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
            onChange={(event) => {
              handleSelectType(event);
            }}
          >
            {dataVariables.length
              ? dataVariables.map((dataVar) => {
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
            onChange={(event) => {
              handleSelectSensor(event);
            }}
          >

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
