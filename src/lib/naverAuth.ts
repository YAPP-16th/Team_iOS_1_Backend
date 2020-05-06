const request = require('request');

export const naverVerify = async (token: string) => {
  return new Promise((resolve, reject) => {
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
};
