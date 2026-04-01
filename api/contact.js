export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const htmlContent = `
      <div style="font-family: sans-serif; color: #333;">
        <h2>Nouveau message de contact - Portfolio</h2>
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Sujet :</strong> ${subject || 'Non spécifié'}</p>
        <hr />
        <h3>Message :</h3>
        <p style="white-space: pre-wrap;">${message}</p>
      </div>
    `;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer re_gppH4Mda_PHYQcw4nKqkXFMQo4pcxaAsm`
      },
      body: JSON.stringify({
        from: 'Carla Ananou <no-reply@orylis.fr>',
        to: 'carlaananou@gmail.com',
        subject: `Nouveau message de contact : ${subject || name}`,
        html: htmlContent,
        reply_to: email
      })
    });

    if (response.ok) {
      const data = await response.json();
      return res.status(200).json({ message: 'Message envoyé avec succès', id: data.id });
    } else {
      const errorData = await response.json();
      return res.status(response.status).json({ message: 'Erreur lors de l\'envoi', error: errorData });
    }
  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
