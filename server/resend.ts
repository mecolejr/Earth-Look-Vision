import { Resend } from 'resend';

let connectionSettings: any;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  if (!connectionSettings || (!connectionSettings.settings.api_key)) {
    throw new Error('Resend not connected');
  }
  return { apiKey: connectionSettings.settings.api_key, fromEmail: connectionSettings.settings.from_email };
}

export async function getResendClient() {
  const { apiKey, fromEmail } = await getCredentials();
  return {
    client: new Resend(apiKey),
    fromEmail
  };
}

export async function sendWelcomeEmail(toEmail: string) {
  const { client, fromEmail } = await getResendClient();
  
  return await client.emails.send({
    from: fromEmail || 'EarthLook <noreply@earthlook.app>',
    to: toEmail,
    subject: 'Welcome to EarthLook Newsletter!',
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="font-family: 'Libre Baskerville', serif; color: #6B4E9C;">Welcome to EarthLook!</h1>
        <p>Thank you for subscribing to our newsletter. You'll receive personalized city recommendations based on your identity and priorities.</p>
        <p>We're committed to helping people with marginalized identities find cities where they can thrive.</p>
        <p style="color: #666; font-size: 14px;">If you didn't subscribe to this newsletter, you can safely ignore this email.</p>
      </div>
    `
  });
}

export async function sendNewsletterEmail(toEmail: string, subject: string, htmlContent: string) {
  const { client, fromEmail } = await getResendClient();
  
  return await client.emails.send({
    from: fromEmail || 'EarthLook <noreply@earthlook.app>',
    to: toEmail,
    subject,
    html: htmlContent
  });
}
