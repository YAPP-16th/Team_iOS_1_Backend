import request from 'request';

export const naverVerify = async (token: string) => {
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
        const result = {
          sub: JSON.parse(body).id,
          userId: JSON.parse(body).email,
          nickname: JSON.parse(body).nickname,
          profileImageUrl: JSON.parse(body).profile_image,
        };
        resolve(result);
      } else {
        reject(error);
      }
    });
  });

  return req.response;
};
