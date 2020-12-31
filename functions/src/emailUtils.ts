import * as functions from 'firebase-functions';
import sendgrid from '@sendgrid/mail';

const sendgridApiKey = process.env.SENDGRID_API_KEY || functions.config().sendgrid.apikey;
if (sendgridApiKey) {
  sendgrid.setApiKey(sendgridApiKey);
}

const sendMail = async ({ to, subject, html }: { to: string; subject: string; html: string }) => {
  const message = {
    to,
    from: {
      name: 'Skog & Mark',
      email: 'no-reply@skog-og-mark.kink.no',
    },
    subject,
    html,
  };
  if (sendgridApiKey) {
    return sendgrid.send(message);
  } else {
    functions.logger.debug('No SendGrid API key set, logging outgoing mail instead.', message);
    return;
  }
};

export const sendSignUpMail = ({
  memberId,
  expiry,
  club,
  email,
  signUpLink,
}: {
  memberId: string;
  expiry: string;
  club: string;
  email: string;
  signUpLink: string;
}) => {
  return sendMail({
    to: email,
    subject: 'Nytt abonnement registrert',
    html: `
<html>
   <head>
      <title></title>
   </head>
   <body>Hei,<br />
      <br />
      Ditt abonnement for medlemsnummer <strong>${memberId}</strong> med utløpsdato <strong>${expiry}</strong> hos <strong>${club}</strong> har blitt registrert.<br />
      <br />
      Trykk på følgende lenke for å registrere deg:<br />
      <a href="${signUpLink}">${signUpLink}</a><br />
      <br />
      Med vennlig hilsen<br />
      Skog & Mark
   </body>
</html>
`,
  });
};
