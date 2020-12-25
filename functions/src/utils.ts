import * as functions from 'firebase-functions';
import validate from 'validate.js';
import moment from 'moment';
import qrcode from 'qrcode';
import jwt from 'jsonwebtoken';

const db = functions.app.admin.firestore();

export type Subscription = {
  alias: string;
  memberId: string;
  expiry: string;
  club: string;
};

export const fromBase64 = (input: string) => Buffer.from(input, 'base64').toString('utf8');

export const errorResponse = (code: string, message: string, metadata?: any) => ({ code, message, metadata });

export const getRealOrFakeEmail = (username: string) =>
  username.match(/^\S+@\S+$/) ? username : `${username}@skog-og-mark.kink.no`;

export const getUsername = (realOrFakeEmail: string) => realOrFakeEmail.replace('@skog-og-mark.kink.no', '');

export const getExistingUser = async (memberId: string, club: string) => {
  const uid = await db
    .collection('users')
    .where(`memberIds.${club}`, '==', `${memberId}`)
    .get()
    .then((querySnapshot) => (querySnapshot.size === 1 ? querySnapshot.docs[0].id : undefined));
  const existingUser = await functions.app.admin
    .auth()
    .getUser(uid || '')
    .catch(() => undefined);
  return existingUser;
};

export const createCard = async (uid: string, subscription: Subscription) => {
  const payload = {
    alias: subscription.alias,
    memberId: subscription.memberId,
    expiry: subscription.expiry,
    club: subscription.club,
  };
  const qr = await qrcode.toDataURL(
    jwt.sign(payload, fromBase64(functions.config().createcard.privatekey), { algorithm: 'RS256' })
  );
  const cardId = `${subscription.club}-${subscription.memberId}`;
  const card = {
    ...payload,
    uid,
    qr,
  };
  return await db.collection('cards').doc(cardId).set(card);
};

validate.extend(validate.validators.datetime, {
  parse(value: any) {
    const dateString = String(value).match(/^\d{4}-\d{2}-\d{2}$/);
    return dateString ? +moment.utc(value) : NaN;
  },
  format(value: any) {
    return moment.utc(value).format('YYYY-MM-DD');
  },
});

const getConstraints = () => ({
  alias: {
    presence: true,
    length: {
      minimum: 1,
      maximum: 32,
    },
  },
  memberId: {
    presence: true,
    length: {
      minimum: 1,
      maximum: 32,
    },
  },
  expiry: {
    presence: true,
    date: {
      earliest: moment().format('YYYY-MM-DD'),
    },
  },
  email: {
    presence: true,
    email: true,
  },
  sendSignUpEmail: {
    type: 'boolean',
  },
});

export const validateSubscriptionsBody = (input: any) => {
  if (!Array.isArray(input)) {
    return errorResponse('subscriptions/not-an-array', 'The body must contain an array of subscriptions.');
  }
  const constraints = getConstraints();
  const validationResults = input.map((entry) => {
    const validationMessages = validate(entry, constraints);
    return validationMessages
      ? { status: 'invalid', validationMessages, data: entry }
      : { status: 'valid', data: entry };
  });
  if (validationResults.some((validationResult) => validationResult.status === 'invalid'))
    return errorResponse(
      'subscriptions/invalid-subscriptions',
      'One or more subscriptions are erroneous. See metadata for a complete description.',
      validationResults
    );
  return;
};

export const parseSubscriptionsBody = (
  input: {
    alias: string;
    memberId: string;
    expiry: string;
    email: string;
    sendSignUpEmail?: boolean;
  }[],
  club: string
) => {
  return input.map((entry) => {
    const { email, sendSignUpEmail, ...rest } = entry;
    const subscription: Subscription = { ...rest, club };
    const subscriptionId = `${club}-${subscription.memberId}`;
    return { subscriptionId, subscription, email, sendSignUpEmail };
  });
};