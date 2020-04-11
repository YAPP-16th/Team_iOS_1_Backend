import { OAuth2Client } from 'google-auth-library';

const { CLIENT_ID } = process.env;
const client = new OAuth2Client(CLIENT_ID);

export const verify = async (token: string) => {
  let ticket;

  try {
    ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID!,
    });

    const payload = ticket.getPayload();

    return payload;
  } catch (e) {
    return null;
  }
};
