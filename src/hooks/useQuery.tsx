import React from "react";

interface State<T> {
  data?: T;
  error?: Error;
  loading: boolean;
}

type Action<T> =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: T }
  | { type: "FETCH_ERROR"; payload: Error };

export function useQuery<T = unknown>(
  url: string,
  options?: RequestInit,
  timeout?: number
) {
  const initialState: State<T> = {
    data: undefined,
    error: undefined,
    loading: false,
  };

  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchReducer = (state: State<T>, action: Action<T>): State<T> => {
    switch (action.type) {
      case "FETCH_START":
        return { ...initialState, loading: true };
      case "FETCH_SUCCESS":
        return { ...initialState, data: action.payload };
      case "FETCH_ERROR":
        return { ...initialState, error: action.payload };
      default:
        return state;
    }
  };

  const clearTimer = () => {
    timerRef.current && clearTimeout(timerRef.current);
  };

  const [state, dispatch] = React.useReducer(fetchReducer, initialState);

  React.useEffect(() => {
    //do nothing if there is no url
    if (!url) return;

    //use to prevent setting state when unmounted
    let ignore = false;

    const abortController = new AbortController();
    const signal = abortController.signal;

    async function fetchData() {
      if (timeout) {
        timerRef.current = setTimeout(() => {
          abortController.abort();
          ignore = true;
          dispatch({
            type: "FETCH_ERROR",
            payload: new Error("Request exceeded timeout limit"),
          });
        }, timeout);
      }

      dispatch({ type: "FETCH_START" });
      try {
        // add signal to fetch options
        const defaultOptions: RequestInit = {
          signal,
        };

        const fetchOptions = options
          ? { ...defaultOptions, ...options }
          : defaultOptions;

        const response = await fetch(url, fetchOptions);
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        if (ignore) return;
        const data = (await response.json()) as T;
        clearTimer();
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;
        if (ignore) return;
        clearTimer();
        dispatch({ type: "FETCH_ERROR", payload: e as Error });
      }
    }

    void fetchData();

    return () => {
      //abort fetch on unmount
      abortController.abort();
      ignore = true;
      clearTimer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return state;
}
