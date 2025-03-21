import React from 'react';

interface BusinessFormProps {
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: string;
  businessPostalCode: string;
  businessPostLocation: string;
  businessId: string;
  setBusinessName: (name: string) => void;
  setBusinessEmail: (email: string) => void;
  setBusinessPhone: (phone: string) => void;
  setBusinessAddress: (address: string) => void;
  setBusinessPostalCode: (postalCode: string) => void;
  setBusinessPostLocation: (postLocation: string) => void;
  setBusinessId: (id: string) => void;
}

const BusinessForm: React.FC<BusinessFormProps> = ({
  businessName,
  businessEmail,
  businessPhone,
  businessAddress,
  businessPostalCode,
  businessPostLocation,
  businessId,
  setBusinessName,
  setBusinessEmail,
  setBusinessPhone,
  setBusinessAddress,
  setBusinessPostalCode,
  setBusinessPostLocation,
  setBusinessId,
}) => {
  
  return (
    <div className='business-form flex flex-col justify-center items-center w-full'>
      <h3 className='header mb-20 !pt-0'>Yritystiedot</h3>
      <div>
        <label>Yrityksen nimi:</label>
        <input
          type="text"
          placeholder="Kirjoita yrityksesi nimi"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          required
          className='mb-8 !mt-0'
        />
      </div>
      <div>
        <label>Sähköpostiosoite:</label>
        <input
          type="email"
          placeholder="Yrityksen sähköpostiosoite"
          value={businessEmail}
          onChange={(e) => setBusinessEmail(e.target.value)}
          required
          className='mb-8 !mt-0'
        />
      </div>
      <div>
        <label>Yrityksen puhelinnumero:</label>
        <input
          type="tel"
          placeholder="Kirjoita yrityksesi puhelinnumero"
          value={businessPhone}
          onChange={(e) => setBusinessPhone(e.target.value)}
          required
          className='mb-8 !mt-0'
        />
      </div>
      <div>
        <label>Yrityksen osoite:</label>
        <input
          type="text"
          placeholder="Kirjoita yrityksesi osoite"
          value={businessAddress}
          onChange={(e) => setBusinessAddress(e.target.value)}
          required
          className='mb-8 !mt-0'
        />
      </div>
      <div>
      <label>Yrityksen postinumero:</label>
        <input
          type="text"
          placeholder="Postinumero"
          value={businessPostalCode}
          onChange={(e) => setBusinessPostalCode(e.target.value)}
          required
          className='mb-8 !mt-0'
        />
      </div>
      <div>
      <label className='flex justify-center text-center'>Yrityksen postitoimipaikka<br />
         tai paikkakunta:</label>
        <input
          type="text"
          placeholder="Postitoimipaikka"
          value={businessPostalCode}
          onChange={(e) => setBusinessPostLocation(e.target.value)}
          required
          className='mb-8 !mt-0'
        />
      </div>
      <div> 
        <label>Y-tunnus:</label>
        <input
          type="text"
          placeholder="Kirjoita yrityksesi Y-tunnus"
          value={businessId}
          onChange={(e) => setBusinessId(e.target.value)}
          required
          className='mb-8 !mt-0'
        />
      </div>
    </div>
  );
};

export default BusinessForm;
