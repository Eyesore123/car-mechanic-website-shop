import React from 'react';

export default function Instructions() {
  return (
    <div className='header justify-center items-center self-center text-center m-auto min-h-[700px] md:w-2/3'>
      <div className='mainheader !mt-0 !pt-0 mb-20 lg:mb-20'>Ohjeet
      </div>
      <div className='flex justify-center items-center text-center text-lg'>
        <ul className="list-none m-0 p-0 xl:w-2/3">
            <li className="my-6 text-xl mb-6 pb-6">Asioiminen PNP-Powerin verkkokaupassa on nopeaa ja helppoa.</li>
            <li className="my-6 pb-6 text-xl">1. Rekisteröidy ja tee käyttäjätili (valinnainen).</li>
            <li className="my-6 pb-6 text-xl">2. Valitse haluamasi tuotteet ja lisää ne ostoskoriin.</li>
            <li className="my-6 pb-6 text-xl">3. Siirry tilaamaan klikkaamalla oikealta puolelta löytyvän sivuostoskorin "siirry tilaamaan" -painiketta tai sivun alaviitteestä "Ostoskori"-linkin kautta.</li>
            <li className="my-6 pb-6 text-xl">6. Lisää yhteystietosi "Tilaustiedot"-lomakkeelle.</li>
            <li className="my-6 pb-6 text-xl">5. Siirry yhteenvetosivulle ja tarkasta tilauksesi tiedot. Jos tilauksessa on virheitä, voit palata taaksepäin muokkaamaan tietoja. Kun olet valmis, paina nappia "Lähetä tilaus".</li>
            <li className="my-6 pb-6 text-xl">6. Tilauksesi on nyt lähetetty! Saat tilausvahvistuksen sähköpostiisi. Näet tekemäsi tilaukset myös Oma tili -sivulta jos olet rekisteröitynyt ennen tilausta.</li>
            <li className="my-6 text-xl">
              7. Jos sinulla on jotain kysyttävää tilaukseen liittyen, laita viestiä</li><a 
                className='underline text-blue-600 hover:no-underline' 
                href="https://www.pnp-power.fi/contact" target='_blank'
              >
                yhteydenottolomakkeella
              </a> 
              <li className="my-6 mb-20 text-xl">
              tai lähettämällä viesti osoitteeseen niko.putkinen96@gmail.com. Nopeutat asiointia liittämällä viestiin tilauksesi tilauskoodin. Jokaisella tilauksella on tilauskoodi, joka löytyy  tilausvahvistuksesta ja Oma tili -osiosta.
            </li>
        </ul>
      </div>
    </div>
  );
}
