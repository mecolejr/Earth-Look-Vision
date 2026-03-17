import { Resend } from "resend";

interface Credentials {
    apiKey: string;
    fromEmail: string;
}

/**
 * Issue #18 fix: Cache credentials at module scope after first fetch.
 * Previously getCredentials() made a full HTTP round-trip to the Replit
 * connector on every email send. Now it only fetches once and reuses the result.
 *
 * Issue #19 fix: connectionSettings is now a local variable inside getCredentials
 * rather than a pointless module-level declaration that was reassigned on every call.
 */
let cachedCredentials: Credentials | null = null;

async function getCredentials(): Promise<Credentials> {
    if (cachedCredentials) {
          return cachedCredentials;
    }

  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
    const xReplitToken = process.env.REPL_IDENTITY
      ? "repl " + process.env.REPL_IDENTITY
          : process.env.WEB_REPL_RENEWAL
      ? "depl " + process.env.WEB_REPL_RENEWAL
          : null;

  if (!xReplitToken) {
        throw new Error("X_REPLIT_TOKEN not found for repl/depl");
  }

  // Issue #19 fix: connectionSettings moved to local scope — it has no purpose as
  // a module-level variable since it was always overwritten inside this function.
  const connectionSettings = await fetch(
        "https://" +
          hostname +
          "/api/v2/connection?include_secrets=true&connector_names=resend",
    {
            headers: {
                      Accept: "application/json",
                      X_REPLIT_TOKEN: xReplitToken,
            },
    }
      )
      .then((res) => res.json())
      .then((data) => data.items?.[0]);

  if (!connectionSettings || !connectionSettings.settings.api_key) {
        throw new Error("Resend not connected");
  }

  cachedCredentials = {
        apiKey: connectionSettings.settings.api_key,
        fromEmail: connectionSettings.settings.from_email,
  };

  return cachedCredentials;
}

export async function getResendClient(): Promise<{
    client: Resend;
    fromEmail: string;
}> {
    const { apiKey, fromEmail } = await getCredentials();
    return { client: new Resend(apiKey), fromEmail };
}

export async function sendWelcomeEmail(toEmail: string) {
    const { client, fromEmail } = await getResendClient();
    return await client.emails.send({
          from: fromEmail || "EarthLook <noreply@earthlook.app>",
          to: toEmail,
          subject: "Welcome to EarthLook Newsletter!",
          html: `
                <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h1 style="font-family: 'Libre Baskerville', serif; color: #6B4E9C;">Welcome to EarthLook!</h1>
                                <p>Thank you for subscribing to our newsletter. You'll receive personalized city recommendations based on your identity and priorities.</p>
                                        <p>We're committed to helping people with marginalized identities find cities where they can thrive.</p>
                                                <p style="color: #666; font-size: 14px;">If you didn't subscribe to this newsletter, you can safely ignore this email.</p>
                                                      </div>
                                                          `,
    });
}

export async function sendNewsletterEmail(
    toEmail: string,
    subject: string,
    htmlContent: string
  ) {
    const { client, fromEmail } = await getResendClient();
    return await client.emails.send({
          from: fromEmail || "EarthLook <noreply@earthlook.app>",
          to: toEmail,
          subject,
          html: htmlContent,
    });
}
