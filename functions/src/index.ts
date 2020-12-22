import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import * as functions from 'firebase-functions';
import * as qrcode from 'qrcode';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import validateFirebaseIdToken from './validateFirebaseIdToken';

const region = 'europe-west3';
const db = functions.app.admin.firestore();
// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

const app = express();
app.use(cors({ origin: true }));
app.use(bodyParser.json());
app.use(validateFirebaseIdToken(functions));

app.get('/cards', async (req, res) => {
  await db
    .collection('cards')
    .get()
    .then((querySnapshot) => res.send(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))));
});

type Subscription = { alias: string; memberId: string; expiry: string; email: string; club: string };
app.put('/subscriptions/:club', async (req, res) => {
  const club = req.params.club;
  const subscriptions: Subscription[] = req.body.map((entry: Omit<Subscription, 'club'>) => ({ ...entry, club }));
  await Promise.all(
    subscriptions.map((subscription) => {
      const subscriptionId = `${club}-${subscription.memberId}`;
      const { email, ...subscriptionWithoutEmail } = subscription;
      return db
        .collection('subscriptions')
        .doc(subscriptionId)
        .set(subscriptionWithoutEmail)
        .then(async () => {
          const uid = await db
            .collection('users')
            .where(`memberIds.${subscription.club}`, '==', `${subscription.memberId}`)
            .get()
            .then((querySnapshot) => {
              if (querySnapshot.size === 1) {
                return querySnapshot.docs[0].id;
              }
              return;
            });
          const existingUser = uid && await functions.app.admin
            .auth()
            .getUser(uid)
            .catch(() => undefined);
          if (existingUser) {
            await createCard(existingUser.uid, subscription);
          } else {
            const token = jwt.sign(
              { club: subscription.club, memberId: subscription.memberId },
              functions.config().createcard.privatekey,
              { algorithm: 'RS256' }
            );
            // Send this link in an e-mail
            console.log(subscription.alias, `${functions.config().client.host}/signup?token=${token}&email=${subscription.email}`);
          }
        });
    })
  )
    .then(async () => {
      return res.send('Successfully!');
    })
    .catch((error) => {
      functions.logger.log('Bork: ', error);
      return res.send('Something borked');
    });
});

export const api = functions.region(region).https.onRequest(app);

const createCard = async (uid: string, subscription: Subscription) => {
  const payload = {
    alias: subscription.alias,
    memberId: subscription.memberId,
    expiry: subscription.expiry,
    club: subscription.club,
  };
  const qr = await qrcode.toDataURL(
    jwt.sign(payload, functions.config().createcard.privatekey, { algorithm: 'RS256' })
  );
  const cardId = `${subscription.club}-${subscription.memberId}`;
  const card = {
    ...payload,
    uid,
    qr,
  };
  await db.collection('cards').doc(cardId).set(card);
};

const getRealOrFakeEmail = (username: string) =>
  username.match(/^\S+@\S+$/) ? username : `${username}@skog-og-mark.kink.no`;

export const signup = functions.region(region).https.onRequest(async (request, response) =>
  cors({ origin: true })(request, response, async () => {
    if (request.method !== 'POST') {
      response.sendStatus(405);
      return;
    }
    const { username, password, token } = request.body;
    const realOrFakeEmail = getRealOrFakeEmail(username);
    try {
      jwt.verify(token, functions.config().createcard.privatekey, { algorithms: ['RS256'] });
    } catch {
      response.sendStatus(400);
      return;
    }
    const existingUser = await functions.app.admin
      .auth()
      .getUserByEmail(realOrFakeEmail)
      .catch(() => undefined);
    if (existingUser) {
      response.sendStatus(409);
      return;
    }
    const { club, memberId } = jwt.decode(token) as { club: string; memberId: string };
    await functions.app.admin.auth().createUser({ uid: username, email: realOrFakeEmail, password });
    await db
      .collection('users')
      .doc(username)
      .set({ username, memberIds: { [club]: memberId } });

    await db
      .collection('subscriptions')
      .where('club', '==', club)
      .where('memberId', '==', memberId)
      .get()
      .then(async (querySnapshot) => {
        await Promise.all(
          querySnapshot.docs
            .map((doc) => doc.data() as Subscription)
            .map((subscription) => createCard(username, subscription))
        );
      });
    response.send('Success!');
  })
);

export const auth = functions.region(region).https.onRequest(async (request, response) =>
  cors({ origin: true })(request, response, async () => {
    if (request.method !== 'POST') {
      response.sendStatus(405);
      return;
    }
    const { username, password } = request.body;
    if (!username || !password) {
      response.sendStatus(400);
      return;
    }
    const user = await db
      .collection('users')
      .doc(username)
      .get()
      .then((userDocument) => (userDocument.exists ? userDocument.data() : undefined));
    if (user) {
      const result = await bcrypt.compare(password, user.hash);
      if (result) {
        const token = await functions.app.admin.auth().createCustomToken(username);
        response.status(200).send({ token, user: { uid: username, memberIds: user.memberIds } });
      } else {
        response.sendStatus(401);
      }
    } else {
      response.sendStatus(401);
    }
  })
);

export const onDeleteUser = functions.auth.user().onDelete(async (user) => {
  await db.collection('users').doc(user.uid).delete().catch(() => {})
  return user;
});
