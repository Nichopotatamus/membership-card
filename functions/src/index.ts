import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import * as functions from 'firebase-functions';
import * as qrcode from 'qrcode';
import validateFirebaseIdToken from './validateFirebaseIdToken';

const db = functions.app.admin.firestore();
// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

const app = express();
app.use(cors({ origin: true }));
app.use(bodyParser.json());
app.use(validateFirebaseIdToken(functions));

app.get('/user/cards', async (req, res) => {
  await db
    .collection('cards')
    .where('email', '==', res.locals.user.email)
    .get()
    .then((querySnapshot) => res.send(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))))
    .catch((error) => res.send('Something borked.'));
});

app.get('/cards', async (req, res) => {
  await db
    .collection('cards')
    .get()
    .then((querySnapshot) => res.send(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))))
    .catch((error) => res.send('Something borked.'));
});

app.get('/subscriptions', async (req, res) => {
  await db
    .collection('subscriptions')
    .get()
    .then((querySnapshot) => res.send(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))))
    .catch((error) => res.send('Something borked.'));
});

app.get('/users', async (req, res) => {
  await functions.app.admin
    .auth()
    .getUsers([{ email: 'nicholas@paulik.no' }])
    .then((getUsersResult) => res.send(getUsersResult.users));
});

app.get('/clear', async (req, res) => {
  await Promise.all([
    db
      .collection('subscriptions')
      .listDocuments()
      .then((results) => results.map((result) => result.delete())),
    db
      .collection('cards')
      .listDocuments()
      .then((results) => results.map((result) => result.delete())),
  ])
    .then(() => res.send('Success!'))
    .catch(() => res.send('Failure!'));
});

type Subscription = { memberId: string; expiry: string; email: string; club: string };
app.post('/subscriptions/:club', async (req, res) => {
  const subscriptions: Omit<Subscription, 'club'>[] = req.body;
  const addedIds: string[] = [];
  const club = req.params.club;
  await Promise.all(
    subscriptions.map((subscription) => {
      const subscriptionId = `${club}-${subscription.memberId}`;
      addedIds.push(subscriptionId);
      return db
        .collection('subscriptions')
        .doc(subscriptionId)
        .set({ ...subscription, club });
    })
  )
    .then(async () => {
      await db
        .collection('subscriptions')
        .listDocuments()
        .then((results) =>
          Promise.all(results.filter((result) => !addedIds.includes(result.id)).map((result) => result.delete()))
        );
      await db
        .collection('cards')
        .listDocuments()
        .then((results) =>
          Promise.all(results.filter((result) => !addedIds.includes(result.id)).map((result) => result.delete()))
        );
      return res.send('Successfully!');
    })
    .catch((error) => {
      functions.logger.log('Bork: ', error);
      return res.send('Something borked');
    });
});

export const api = functions.region('europe-west3').https.onRequest(app);

export const createCard = functions
  .region('europe-west3')
  .firestore.document('subscriptions/{docId}')
  .onWrite(async (snapshot, context) => {
    if (snapshot.after.data()) {
      const subscription = <Subscription>snapshot.after.data()!;
      await functions.app.admin
        .auth()
        .getUserByEmail(subscription.email)
        .then(async () => {
          const qr = await qrcode.toDataURL(
            JSON.stringify({ memberId: subscription.memberId, expiry: subscription.expiry })
          );
          const cardId = `${subscription.club}-${subscription.memberId}`;
          const card = {
            memberId: subscription.memberId,
            club: subscription.club,
            expiry: subscription.expiry,
            email: subscription.email,
            qr,
          };
          await db.collection('cards').doc(cardId).set(card);
        })
        .catch(() => {
          // Do nothing when there is no user
        });
    }
    return snapshot;
  });

/*
export const helloWorld = functions.region('europe-west3').https.onRequest((request, response) => {
  functions.logger.info('Hello logs!', { structuredData: true });
  functions.app.admin
    .auth()
    .createUser({ email: 'test123@example.com' })
    .then(() => response.send('Success!'))
    .catch(() => response.send('Failure!'));
});

exports.sendWelcomeEmail = functions.region('europe-west3').auth.user().onCreate((user) => {
  console.log('My function that logs a created user', user.displayName);
});
*/
