import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminSendNewsLetter = () => {
  const [templateId, setTemplateId] = useState('');
  const [recipient, setRecipient] = useState('');
  const [testEmail, setTestEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('/api/newsletter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        templateId,
        recipient,
        testEmail,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (response.ok) {
      toast.success('Uutiskirjeen lähettäminen onnistui!');
    } else {
      toast.error('Uutiskirjeen lähettäminen epäonnistui. Ota yhteyttä ylläpitoon.');
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.indexOf('application/json') !== -1) {
      const json = await response.json();
      console.log('Response JSON:', json);
    } else {
      console.log('Response:', await response.text());
    }
  };

  return (
    <div className='text-center flex flex-col justify-center'>
    <div className='textbox text-center'>Voit lähettää uutiskirjeen seuraavalla tavalla:</div>
    <div className='textbox text-center'>1. Kirjoita templaatin ID.</div>
    <div className='textbox text-center'>2. Testaa uutiskirje lähettämällä se ensin omaan sähköpostiisi. Kirjoita vastaanottajan kohdalle "test" ja sähköpostiosoitteeksi laita oma sähköpostiosoite. Klikkaa "Lähetä uutiskirje" ja uutiskirje saapuu omaan sähköpostiisi.</div>
    <div className='textbox text-center'>3. Jos uutiskrje näyttää hyvältä ja linkit toimivat oikein, voit lähettää uutiskirjeen tilaajille kirjoittamalla vastaanottajan kohdalle "subscribers" ja klikkaamalla "Lähetä uutiskirje". Jätä testisähköpostiosoitteen kohdalle tyhjä kenttä kun lähetät uutiskirjeen tilaajille.</div>
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="templateId" className='mt-4'>Templaatin ID:</label>
        <input
          type="text"
          id="templateId"
          value={templateId}
          onChange={(e) => setTemplateId(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="recipient" className='mt-4'>Vastaanottaja:</label>
        <input
          type="text"
          id="recipient"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="testEmail" className='mt-4'>Testisähköpostiosoite (kirjoita testisähköpostiosoite vain jos ylemmässä kentässä lukee'test'):</label>
        <input
          type="email"
          id="testEmail"
          value={testEmail}
          onChange={(e) => setTestEmail(e.target.value)}
        />
      </div>
      <button type="submit" className='submitbtn mt-6'>Lähetä uutiskirje</button>
    </form>
    </div>
  );
};

export default AdminSendNewsLetter;