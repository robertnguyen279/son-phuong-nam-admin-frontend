import axios from 'axios';
import jwt_decode from 'jwt-decode';

// dev
// const baseURL = 'https://tcbg3jx755.execute-api.ap-southeast-1.amazonaws.com';

// prod
const baseURL = 'https://bdxuiwz26k.execute-api.ap-southeast-1.amazonaws.com';

const axiosInstance = axios.create({
  baseURL,
});

axiosInstance.interceptors.request.use(
  async (req): Promise<typeof req> => {
    const authTokens = localStorage.getItem('SonPhuongNamAuthTokens')
      ? JSON.parse(localStorage.getItem('SonPhuongNamAuthTokens'))
      : null;

    if (!authTokens) {
      return req;
    }

    req.headers.Authorization = `Bearer ${authTokens?.accessToken}`;

    const user: { userId: string; iat: number; exp: number } = jwt_decode(authTokens.accessToken);

    if (Date.now() <= user.exp * 1000) {
      return req;
    }

    try {
      const response = await axios.post(`${baseURL}/user/token/`, {
        token: authTokens.refreshToken,
      });

      localStorage.setItem(
        'SonPhuongNamAuthTokens',
        JSON.stringify({ accessToken: response.data.accessToken, refreshToken: response.data.refreshToken }),
      );
      req.headers.Authorization = `Bearer ${response.data.accessToken}`;
    } catch (error) {
      console.log({ ...error });
    }

    return req;
  },
);

export default axiosInstance;
