import * as functions from 'firebase-functions';
import { firestore } from 'firebase-admin';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import validateFirebaseIdToken from './validateFirebaseIdToken';
import {
  fromBase64,
  errorResponse,
  getRealOrFakeEmail,
  getUsername,
  validateSubscriptionsBody,
  createCard,
  getExistingUser,
  parseSubscriptionsBody,
  linkSubscriptions,
} from './utils';

const region = 'europe-west3';
const db = functions.app.admin.firestore();

const app = express();
app.use(cors({ origin: true }));
app.use(bodyParser.json());

app.get('/cards', validateFirebaseIdToken, async (req, res) => {
  const uid: string = res.locals.user.uid;
  res.header('Access-Control-Expose-Headers', 'Date');
  const userData = await db
    .collection('users')
    .doc(uid)
    .get()
    .then((doc) => (doc.exists ? doc.data() : undefined));
  if (userData) {
    const cardIds = Object.keys(userData.memberIds).map(
      (club: string) => `${club}-${userData.memberIds[club]}`
    );
    const cards = await db
      .collection('cards')
      .where(firestore.FieldPath.documentId(), 'in', cardIds)
      .get()
      .then((queryResult) => queryResult.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    res.send(cards);
  } else {
    res.send([]);
  }
});

app.put('/subscriptions/:club', validateFirebaseIdToken, async (req, res) => {
  const club = req.params.club;
  const bodyValidationError = validateSubscriptionsBody(req.body);
  if (bodyValidationError) {
    res.status(400).send(bodyValidationError);
    return;
  }
  const entries = parseSubscriptionsBody(req.body, club);
  const results = await Promise.all(
    entries.map(async ({ subscriptionId, subscription, email, sendSignUpEmail }) => {
      try {
        let emailSent = false;
        let cardCreated = false;
        let signUpLink: string | null = null;
        const subscriptionUpdated = await db
          .collection('subscriptions')
          .doc(subscriptionId)
          .get()
          .then((doc) => doc.exists);
        await db.collection('subscriptions').doc(subscriptionId).set(subscription);
        const existingUser = await getExistingUser(subscription.memberId, subscription.club);
        if (existingUser) {
          await createCard(existingUser.uid, subscription);
          cardCreated = true;
        } else {
          const token = jwt.sign(
            { club: subscription.club, memberId: subscription.memberId },
            fromBase64(functions.config().createcard.privatekey),
            { algorithm: 'RS256' }
          );
          // Send this link in an e-mail
          signUpLink = `${functions.config().client.host}/signup?token=${token}&email=${email}`;
          const shouldSendEmail = !subscriptionUpdated || !!sendSignUpEmail;
          emailSent = shouldSendEmail; // TODO: Change to result of send email function
        }
        return {
          status: 'success',
          subscriptionUpdated,
          existingUser: existingUser ? getUsername(existingUser.email || '') : false,
          cardCreated,
          sendSignUpEmail,
          signUpLink,
          emailSent,
          email,
          subscription,
        };
      } catch (error) {
        functions.logger.error(error);
        return {
          status: 'error',
          errorCode: error.code || 'unknown',
          errorMessage: error.message || 'No message',
          email,
          subscription,
        };
      }
    })
  );
  res.send(results);
});

app.post('/signup', async (req, res) => {
  const { username, password, token } = req.body;
  const realOrFakeEmail = getRealOrFakeEmail(username);
  try {
    jwt.verify(token, fromBase64(functions.config().createcard.publickey), { algorithms: ['RS256'] });
  } catch {
    res.status(400).send(errorResponse('signup/invalid-token', 'The provided token is not valid.'));
    return;
  }
  const existingUser = await functions.app.admin
    .auth()
    .getUserByEmail(realOrFakeEmail)
    .catch(() => undefined);
  if (existingUser) {
    res
      .status(409)
      .send(
        username === realOrFakeEmail
          ? errorResponse('signup/email-already-in-use', 'The email address is already in use by another account.')
          : errorResponse('signup/username-already-in-use', 'The username is already in use by another account.')
      );
    return;
  }
  const { club, memberId } = jwt.decode(token) as { club: string; memberId: string };
  const newUser = await functions.app.admin.auth().createUser({ email: realOrFakeEmail, password });
  await db
    .collection('users')
    .doc(newUser.uid)
    .set({ username, memberIds: { [club]: memberId } });
  await linkSubscriptions(newUser.uid, memberId, club);
  res.send({ message: 'Success!' });
});

app.post('/link', validateFirebaseIdToken, async (req, res) => {
  // TODO: Clean up and type better.
  const uid: string = res.locals.user.uid;
  const { token } = req.body;
  try {
    jwt.verify(token, fromBase64(functions.config().createcard.publickey), { algorithms: ['RS256'] });
  } catch {
    res.status(400).send(errorResponse('signup/invalid-token', 'The provided token is not valid.'));
    return;
  }
  const user = await functions.app.admin
    .auth()
    .getUser(uid)
    .catch(() => undefined);
  if (!user) {
    res.status(400).send(errorResponse('signup/invalid-user', 'The user could not be found in our system.'));
    return;
  }
  const { club, memberId } = jwt.decode(token) as { club: string; memberId: string };
  try {
    const userData = await db
      .collection('users')
      .doc(user.uid)
      .get()
      .then((doc) => doc.data());
    await db
      .collection('users')
      .doc(user.uid)
      .set({
        ...userData,
        memberIds: { ...userData!.memberIds, [club]: memberId },
      });
    await linkSubscriptions(user.uid, memberId, club);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(errorResponse(error.code, error.message));
  }
});

export const api = functions.region(region).https.onRequest(app);

export const onDeleteUser = functions
  .region(region)
  .auth.user()
  .onDelete(async (user) => {
    // TODO: Clean up and make more resilient to errors.
    await db
      .collection('users')
      .doc(user.uid)
      .delete()
      .catch(() => undefined);
    await db
      .collection('cards')
      .where('uid', '==', user.uid)
      .get()
      .then((querySnapshot) => querySnapshot.forEach(async (doc) => await doc.ref.delete()));
    return user;
  });
