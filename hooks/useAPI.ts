import { useState, useEffect, useCallback } from "react";
import { get, post } from "../src/httpService";

export function useAPI({
  url,
  method = "GET",
  body = null,
  executeOnMount = false,
}: {
  url: string;
  method: string;
  body: any;
  executeOnMount: boolean;
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (method === "GET") {
        response = await get(url);
      } else if (method === "POST") {
        response = await post(url, body);
      }
      setData(response);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [url, method, body]);

  useEffect(() => {
    if (executeOnMount) {
      fetchData();
    }
  }, [fetchData, executeOnMount]);

  return { data, loading, error, refetch: fetchData };
}
