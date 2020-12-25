import * as validate from 'validate.js';
import * as moment from 'moment';

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

export const fromBase64 = (input: string) => Buffer.from(input, 'base64').toString('utf8');

export const errorResponse = (code: string, message: string, metadata?: any) => ({ code, message, metadata });

export const getRealOrFakeEmail = (username: string) =>
  username.match(/^\S+@\S+$/) ? username : `${username}@skog-og-mark.kink.no`;

export const getUsername = (realOrFakeEmail: string) => realOrFakeEmail.replace('@skog-og-mark.kink.no', '');
