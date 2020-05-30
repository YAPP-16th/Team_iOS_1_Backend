import request from 'request';
import { OAuth2Client } from 'google-auth-library';
import { string } from 'joi';
const { CLIENT_ID } = process.env;
const client = new OAuth2Client(CLIENT_ID);

export const facebook = async (token: string) => {
  const result: any = new Promise((resolve, reject) => {
    const option = {
      uri: 'https://graph.facebook.com/v7.0/me',
      qs: {
        fields: 'id, email, name, picture',
        access_token: token,
      },
    };

    request.get(option, function(
      error: any,
      response: { statusCode: number },
      body: string,
      ){
      if (!error && response.statusCode == 200) {
        const result = {
          sub: JSON.parse(body).id,
          email: JSON.parse(body).email,
          name: JSON.parse(body).name,
          picture: JSON.parse(body).picture.data.url,
        };
        resolve(result);
      }else{
        reject(error);
      }
    });
  });
  
  return result;
}

export const google = async (token: string) => {
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
}

export const kakao = async (token: string) => {
  const result: any = new Promise((resolve, reject) => {
    const options = {
      url: 'https://kapi.kakao.com/v2/user/me',
      headers: { Authorization: 'Bearer ' + token },
    };

    request.get(options, function (
      error: any,
      response: { statusCode: number },
      body: string,
    ) {
      if (!error && response.statusCode == 200) {
        const result = {
          sub: JSON.parse(body).id.toString(),
          email: JSON.parse(body).kakao_account.email,
          name: JSON.parse(body).properties.nickname,
          picture: JSON.parse(body).properties.profile_image,
        };
        resolve(result);
      } else {
        reject(error);
      }
    });
  });

  return result;
}

export const naver = async (token: string) => {
  const result: any = await new Promise((resolve, reject) => {
    const options = {
      url: 'https://openapi.naver.com/v1/nid/me',
      headers: { Authorization: 'Bearer ' + token },
    };

    request.get(options, function (
      error: any,
      response: { statusCode: number },
      body: string,
    ) {
      if (!error && response.statusCode == 200) {
        const result = {
          sub: JSON.parse(body).response.id,
          email: JSON.parse(body).response.email,
          name: JSON.parse(body).response.name,
          picture: JSON.parse(body).response.profile_image,
        };
        resolve(result);
      } else {
        reject(error);
      }
    });
  });

  return result;
}

