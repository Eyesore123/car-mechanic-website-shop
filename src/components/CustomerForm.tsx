import React from 'react';

interface CustomerFormProps {
  name: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
  postLocation: string;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setPhone: (phone: string) => void;
  setAddress: (address: string) => void;
  setPostalCode: (postalCode: string) => void;
  setPostLocation: (postLocation: string) => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ name, email, phone, address, postalCode, postLocation, setName, setEmail, setPhone, setAddress, setPostalCode, setPostLocation }) => {
  return (
    <div>
      <div>
        <label>Nimi:</label>
        <input
          type="text"
          placeholder="Kirjoita nimesi"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className='mb-8 !mt-0'
        />
      </div>
      <div>
        <label>Sähköpostiosoite:</label>
        <input
          type="email"
          placeholder="Sähköpostiosoite"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className='mb-8 !mt-0'
        />
      </div>
      <div>
        <label>Puhelinnumero:</label>
        <input
          type="tel"
          placeholder="Lisää puhelinnumero"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className='mb-8 !mt-0'
        />
      </div>
      <div>
        <label>Osoite:</label>
        <input
          type="text"
          placeholder="Osoite"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          className='mb-8 !mt-0'
          />
      </div>
      <div>
        <label>Postinumero:</label>
        <input
          type="text"
          placeholder="Postinumero"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          required
          className='mb-8 !mt-0'
        />
        </div>
        <div>
        <label>Postitoimipaikka tai paikkakunta:</label>
        <input
          type="text"
          placeholder="Postitoimipaikka"
          value={postLocation}
          onChange={(e) => setPostLocation(e.target.value)}
          required
          className='mb-8 !mt-0'
        />
        </div>
    </div>
    
  );
};

export default CustomerForm;
