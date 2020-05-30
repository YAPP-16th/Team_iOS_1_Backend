import request from 'request';

export const kakaoVerify = async (token: string) => {
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
};
