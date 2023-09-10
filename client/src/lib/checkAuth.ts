import Cookies from "js-cookie";

export default async function checkAuth() {
  const authToken = Cookies.get("auth-token");

  if (!authToken) {
    return { success: false };
  }
  try {
    const res = await fetch(`http://localhost:8000/auth/status`, {
      headers: { "auth-token": authToken! },
    });
    const resData = await res.json();
    return resData;
  } catch (error) {
    return { success: false };
  }
}
