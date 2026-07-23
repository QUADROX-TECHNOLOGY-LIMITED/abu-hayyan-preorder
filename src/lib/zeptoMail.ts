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

  const htmlBody = isPreorder 
    ? `
      <h2>Payment Confirmed!</h2>
      <p>Dear ${name},</p>
      <p>Jazakumullahu Khayran for your pre-order of <strong>Pearls from the Masterpieces of Abu Hayyan</strong>.</p>
      <p><strong>Your Unique Order ID: ${orderId}</strong></p>
      <p>Please keep this Order ID safe. You will need it for pickup at the launch ceremony or for tracking your home delivery.</p>
      <br/>
      <p>Warm regards,<br/>Abu Hayyãn</p>
    `
    : `
      <h2>Jazakumullahu Khayran!</h2>
      <p>Dear ${name},</p>
      <p>Your sponsorship for <strong>Pearls from the Masterpieces of Abu Hayyan</strong> has been successfully received.</p>
      <p>May Allah reward you abundantly for spreading beneficial knowledge and supporting the preservation of our Islamic literary heritage.</p>
      <br/>
      <p>Warm regards,<br/>Abu Hayyãn</p>
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
        from: {
          address: "dev@quadroxtech.cloud",
          name: "Quadrox For Abu Hayyan Schools"
        },
        to: [{ email_address: { address: toEmail, name: name } }],
        subject: subject,
        htmlbody: htmlBody,
      })
    });

    if (!response.ok) throw new Error('ZeptoMail dispatch failed');
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
}
