import './About.css'
import { Html } from '@react-three/drei';
import React from 'react';

type AboutProps = {
  isOpen: boolean;
  onClose: () => void;
};

function About(props: AboutProps) {
  if (!props.isOpen) return null;

  return (
    <Html>
      <div className='about'>
        <h2>generest</h2>
        <p>Generative music playground using public APIs as input.</p>
        <button onClick={props.onClose}>Close</button>
      </div>
    </Html>
  );
}

export default About;
