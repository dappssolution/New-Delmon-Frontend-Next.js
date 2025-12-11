import Cookies from "js-cookie";

const TOKEN_KEY = "token";

export const setAuthToken = (token: string) => {
  Cookies.set(TOKEN_KEY, token, {
    expires: 7,
    secure: true,
    sameSite: "strict",
  });
};

export const getAuthToken = () => {
  return Cookies.get(TOKEN_KEY);
};

export const removeAuthToken = () => {
  Cookies.remove(TOKEN_KEY);
};
