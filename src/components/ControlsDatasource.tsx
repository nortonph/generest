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
  return (
    <Html className='controlsHtml'>
      <div className='controls'>
        <p>API</p>
        <button onClick={props.handleClose} className='buttonClose'>
          close
        </button>
      </div>
    </Html>
  );
}

export default ControlsDatasource;
