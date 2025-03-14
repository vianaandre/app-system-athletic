import axios from "axios";
import { VITE_API_BASE_URL } from "@env";

type TRequest = "GET" | "POST" | "PUT" | "DELETE";

export const requestApi = async (
  path: string,
  requestType: TRequest,
  body?: any,
  headers?: Record<string, string>,
  responseType?: string
) => {
  const baseUrl = VITE_API_BASE_URL;

  try {
    const baseRequest: Axios.AxiosXHRConfig<ResponseType> = {
      method: requestType,
      url: `${baseUrl}${path}`,
      headers: headers,
      responseType: responseType,
    }

    if(body) {
      baseRequest.data = body
    }

    const response = await axios<any>(baseRequest);
    
    return response;
    
  } catch (error) {
    console.error("Request API Error:", error);
    throw error;
  }
};