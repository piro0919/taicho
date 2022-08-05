import axios, { AxiosResponse } from "axios";

const fetcher = (url: string): Promise<AxiosResponse> =>
  axios.get(url).then((res) => res.data);

export default fetcher;
