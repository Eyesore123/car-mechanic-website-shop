// Used for sending email with sendgrid
import sgMail from '@sendgrid/mail';
import { NextApiRequest, NextApiResponse } from 'next';
import dotenv from 'dotenv';

dotenv.config();

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  throw new Error('SENDGRID_API_KEY environment variable is not set');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, subject, html, adminEmail, adminSubject, adminHtml } = req.body;

    const customerMsg = {
      to: email,
      from: 'joni.putkinen@protonmail.com', // Verified sender email!
      subject,
      html,
    };

    const adminMsg = {
      to: adminEmail,
      from: 'joni.putkinen@protonmail.com', // Verified sender email!
      subject: adminSubject,
      html: adminHtml,
    };

    try {
      await sgMail.send(customerMsg);
      await sgMail.send(adminMsg);
      res.status(200).json({ message: 'Emails sent successfully' });
    } catch (error: any) {
      console.error('Error sending email:', error.response.body.errors);
      res.status(500).json({ message: 'Error sending email' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}