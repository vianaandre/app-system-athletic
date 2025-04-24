import { API_BASE_URL } from "@env";
import axios, { AxiosRequestConfig, ResponseType } from "axios";

type TRequest = "GET" | "POST" | "PUT" | "DELETE";

export const requestApi = async (
  path: string,
  requestType: TRequest,
  body?: any,
  headers?: Record<string, string>,
  responseType?: ResponseType
) => {
  const baseUrl = 'https://api.xyzonline.site';

  try {
    const baseRequest: AxiosRequestConfig = {
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