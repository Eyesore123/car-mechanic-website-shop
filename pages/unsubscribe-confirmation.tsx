import React from 'react';
import '../src/app/globals.css';

const UnsubscribeConfirmation = () => {
  return (
    <div className="unsubscribe-confirmation flex flex-col justify-center items-center text-center w-full min-h-[1000px]">
      <h2 className='mainheader mt-20'>Olet peruuttanut uutiskirjeen tilauksen onnistuneesti.</h2>
      <p>Jos haluat tilata uutiskirjeen uudelleen, voit tehdä sen milloin tahansa PNP-Power verkkokaupan Oma tili -sivulta.</p>
      <p>Kiitos, että olit tilaajamme! </p>
        <p>t. Niko / PNP-Power</p>
        <p><a className='underline text-blue-600 hover:no-underline' href="https://www.pnp-power.fi" target='_blank'>PNP-POWER</a></p>
    </div>
  );
};

export default UnsubscribeConfirmation;