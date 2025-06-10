import { jwtDecode } from "jwt-decode";

export const getAccessToken = () => localStorage.getItem("accessToken");

export const getDecodedToken = () => {
  const token = getAccessToken();
  if (!token) return null;
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
};

export const getRole = () => {
  const user: any = getDecodedToken();
  return user?.role?._id;
};

export const hasRole = (allowedRoles: number[]) => {
  const decoded: any = getDecodedToken();
  return decoded && allowedRoles.includes(decoded?.role?._id);
};
