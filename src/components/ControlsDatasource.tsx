/*  This component renders the module controls onto the 3d Shape
 */

import './Controls.css';
import { Html } from '@react-three/drei';
import { Datasource } from '../datasource';

interface ControlsDatasourceProps {
  datasource: Datasource;
  handleClose: () => void;
}

function ControlsDatasource(props: ControlsDatasourceProps) {

  const handleSelectType = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(event.target.value);
    props.datasource.setDataVariable(event.target.value);
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
