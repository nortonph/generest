/*  This component renders the module controls onto the 3d Shape
 */

import './Controls.css';
import { Html } from '@react-three/drei';

function ControlsDatasource() {
  return (
    <Html className='controlsHtml'>
      <div className='controls'>
        <p>API</p>
      </div>
    </Html>
  );
}

export default ControlsDatasource;
