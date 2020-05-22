import request from 'request';

export const facebookVerify = async (token: string) => {
  const result : any = new Promise((resolve, reject) => {
    const option = {
      uri: 'https://graph.facebook.com/v7.0/me',
      qs: {
        fields: 'id, email, name, picture',
        access_token: token,
      },
    };

    request(option, (err, response ,res) => {
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
};