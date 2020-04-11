import * as crypto from 'crypto';

export const createToken = async (value: string  | undefined='') => {
  const key = await new Promise((resolve, reject) => {
    crypto.randomBytes(64, (err, buf) => {
      crypto.pbkdf2(
        value,
        buf.toString('base64'),
        108236,
        64,
        'sha512',
        (err, key) => {
          resolve(key.toString('base64'));
        },
      );
    });
  });
  return key;
};
