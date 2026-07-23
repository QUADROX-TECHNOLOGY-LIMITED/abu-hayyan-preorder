export async function sendReceiptEmail(
  toEmail: string, 
  name: string, 
  orderId: string, 
  mode: 'preorder' | 'sponsor'
) {
  const isPreorder = mode === 'preorder';
  const subject = isPreorder 
    ? `Payment Confirmed - Order #${orderId}` 
    : `Jazakumullahu Khayran - Sponsorship Confirmed`;

  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8f9fa;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8f9fa; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
              
              <!-- Header -->
              <tr>
                <td style="background-color: #0f172a; padding: 20px; text-align: center;">
                  <p style="color: #f59e0b; font-size: 11px; font-weight: bold; letter-spacing: 2px; margin: 0; text-transform: uppercase;">
                    QUADROX SENT ON BEHALF OF ABU HAYYAN SCHOOLS
                  </p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding: 40px 30px; color: #334155; line-height: 1.6;">
                  ${isPreorder ? `
                    <h2 style="color: #0f172a; margin-top: 0;">Payment Confirmed!</h2>
                    <p>Dear <strong>${name}</strong>,</p>
                    <p>Jazakumullahu Khayran for your pre-order of <strong>Pearls from the Masterpieces of Abu Hayyan</strong>.</p>
                    
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 30px 0; background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px;">
                      <tr>
                        <td>
                          <p style="margin: 0; font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Your Unique Order ID</p>
                          <p style="margin: 5px 0 0 0; font-size: 28px; color: #b45309; font-weight: 900; letter-spacing: 3px;">${orderId}</p>
                        </td>
                      </tr>
                    </table>

                    <p style="font-size: 14px; color: #64748b;">Please keep this Order ID safe. You will need it for pickup at the launch ceremony or for tracking your home delivery.</p>
                  ` : `
                    <h2 style="color: #0f172a; margin-top: 0;">Jazakumullahu Khayran!</h2>
                    <p>Dear <strong>${name}</strong>,</p>
                    <p>Your sponsorship for <strong>Pearls from the Masterpieces of Abu Hayyan</strong> has been successfully received.</p>
                    <p>May Allah reward you abundantly for spreading beneficial knowledge and supporting the preservation of our Islamic literary heritage.</p>
                  `}
                  <br/>
                  <p style="margin-bottom: 0;">Warm regards,<br/><strong>Abu Hayyãn</strong></p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f1f5f9; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                  <p style="color: #94a3b8; font-size: 10px; font-weight: bold; letter-spacing: 1px; margin: 0; text-transform: uppercase; line-height: 1.8;">
                    &copy; QUADROX TECHNOLOGIES LIMITED 2026<br/>
                    SENT ON BEHALF OF ABU HAYYAN SCHOOLS
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  try {
    const response = await fetch('https://api.zeptomail.com/v1.1/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Zoho-enczapikey ${process.env.ZEPTOMAIL_API_KEY}`
      },
      body: JSON.stringify({
        bounce_address: "bounce@bounce-zem.quadroxtech.cloud",
        from: {
          address: "dev@quadroxtech.cloud",
          name: "Quadrox For Abu Hayyan Schools"
        },
        to: [{ email_address: { address: toEmail, name: name } }],
        subject: subject,
        htmlbody: htmlBody,
      })
    });

    if (!response.ok) {
      // Capture the exact rejection reason from ZeptoMail for debugging
      const errorText = await response.text();
      console.error('ZeptoMail API Error Details:', errorText);
      throw new Error(`ZeptoMail dispatch failed with status: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
}
