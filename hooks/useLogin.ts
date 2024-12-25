import { useState } from "react";
import { login } from "../src/httpService";

export function useLogin() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loginUser = async (url, credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await login(url, credentials);
      setData(response);
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, loginUser };
}
