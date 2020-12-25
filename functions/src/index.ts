import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import * as functions from 'firebase-functions';
import * as jwt from 'jsonwebtoken';
import validateFirebaseIdToken from './validateFirebaseIdToken';
import {
  fromBase64,
  errorResponse,
  getRealOrFakeEmail,
  getUsername,
  validateSubscriptionsBody,
  Subscription,
  createCard,
  getExistingUser,
  parseSubscriptionsBody,
} from './utils';

const region = 'europe-west3';
const db = functions.app.admin.firestore();

const app = express();
app.use(cors({ origin: true }));
app.use(bodyParser.json());

app.put('/subscriptions/:club', validateFirebaseIdToken(functions), async (req, res) => {
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

  await db
    .collection('subscriptions')
    .where('club', '==', club)
    .where('memberId', '==', memberId)
    .get()
    .then(async (querySnapshot) => {
      await Promise.all(
        querySnapshot.docs
          .map((doc) => doc.data() as Subscription)
          .map((subscription) => createCard(newUser.uid, subscription))
      );
    });
  res.send({ message: 'Success!' });
});

export const api = functions.region(region).https.onRequest(app);

export const onDeleteUser = functions
  .region(region)
  .auth.user()
  .onDelete(async (user) => {
    await db
      .collection('users')
      .doc(user.uid)
      .delete()
      .catch(() => undefined);
    return user;
  });
