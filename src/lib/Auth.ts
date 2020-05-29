import request from 'request';
import { OAuth2Client } from 'google-auth-library';
const { CLIENT_ID } = process.env;
const client = new OAuth2Client(CLIENT_ID);


class Verify{

  async facebook (token: string){
    const result : any = new Promise((resolve, reject) => {
      const option = {
        uri: 'https://graph.facebook.com/v7.0/me',
        qs: {
          fields: 'id, email, name, picture',
          access_token: token,
        },
      };
  
      request (option, (err, response ,res) => {
        const userInfo = JSON.parse(res);
  
        if (!err) {
          const info = {
            facebookId: userInfo.id,
            userId: userInfo.email,
            nickname: userInfo.name,
            profileImageUrl: userInfo.picture.data.url,
          };
          resolve(info);
        } else {
          reject(err);
        }
      });
    });
  
    return result;
  }

  async google (token: string){
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

  async kakao (token: stirng){
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
            kakaoId: JSON.parse(body).id.toString(),
            userId: JSON.parse(body).kakao_account.email,
            nickname: JSON.parse(body).properties.nickname,
            profileImageUrl: JSON.parse(body).properties.profile_image,
          };
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
    
    return result;
  }

  async naver (token: string){
    const req: any = await new Promise((resolve, reject) => {
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
          resolve(JSON.parse(body));
        } else {
          reject(error);
        }
      });
    });
  
    return req.response;
  }
}

module.exports = new Verify();