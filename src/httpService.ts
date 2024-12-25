import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginData } from "./model/login";
import { masterDataModel } from "./model/masterData";
import { rmpmHistoryModel } from "./model/rmpmHistory";
import { qcHistoryModel } from "./model/qcHistory";
import { rmpmResampleModel } from "./model/rmpmResample";
import { packagingModel } from "./model/packaging";

const authData = require("../mock/data/login.json");
const masterData = require("../mock/data/masterData.json");
const departmentMasterData = require("../mock/data/department_machines.json");
const ipQCMasterData = require("../mock/data/ipqc_product_masterdata.json");
const rmpmmasterData = require("../mock/data/rm_pm_vendor_masterdata.json");

const CACHE_KEY_PREFIX = "CACHE_";
const RETRY_QUEUE_KEY = "RETRY_QUEUE";
const AUTH_TOKEN_KEY = "AUTH_TOKEN";
const REFRESH_TOKEN_KEY = "REFRESH_TOKEN_KEY";

const httpService = axios.create({
  timeout: 10000,
});

httpService.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      // if (token) {
      //   config.headers.Authorization = `Bearer ${token}`;
      // }
    } catch (error) {
      console.error("Error retrieving auth token:", error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

httpService.interceptors.response.use(
  (response) => response,
  async (error) => {
    // const originalRequest = error.config;

    // if (
    //   error.response &&
    //   error.response.status === 401 &&
    //   !originalRequest._retry
    // ) {
    //   originalRequest._retry = true;
    //   const newToken = await refreshAuthToken();
    //   if (newToken) {
    //     originalRequest.headers.Authorization = `Bearer ${newToken}`;
    //     return httpService(originalRequest);
    //   }
    // }
    return Promise.reject(error);
  }
);

async function refreshAuthToken() {
  try {
    const response = await httpService.post(
      "https://api.example.com/refresh-token",
      {
        refreshToken: await AsyncStorage.getItem("REFRESH_TOKEN"),
      }
    );
    const { token } = response.data;
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    return token;
  } catch (error) {
    console.error("Token refresh failed:", error);
    return null;
  }
}

function isNetworkError(error) {
  return !error.response && error.message === "Network Error";
}
export async function getWithoutCache(url: string) {
  try {
    const response = await httpService.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
}
export async function getWithCache(url: string) {
  const cacheKey = `${CACHE_KEY_PREFIX}${url}`;

  try {
    const response = await httpService.get(url);
    await AsyncStorage.setItem(cacheKey, JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    if (isNetworkError(error)) {
      const cachedData = await AsyncStorage.getItem(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      } else {
        throw new Error("Network error and no cached data available.");
      }
    }
    throw error;
  }
}

export async function postWithRetry(url: string, data: object) {
  const optimisticResponse = {
    status: "success",
    message: "Data submitted successfully.",
  };

  try {
    await httpService.post(url, data);
  } catch (error) {
    if (isNetworkError(error)) {
      await saveRetryRequest({ url, data });
    } else {
      throw error; // Rethrow server-related errors
    }
  }

  return optimisticResponse;
}

async function saveRetryRequest(request: { url: string; data: object }) {
  const savedQueue = await AsyncStorage.getItem(RETRY_QUEUE_KEY);
  const retryQueue = savedQueue ? JSON.parse(savedQueue) : [];
  retryQueue.push(request);
  await AsyncStorage.setItem(RETRY_QUEUE_KEY, JSON.stringify(retryQueue));
}

export async function retryFailedRequests() {
  const savedQueue = await AsyncStorage.getItem(RETRY_QUEUE_KEY);
  const retryQueue = savedQueue ? JSON.parse(savedQueue) : [];

  if (retryQueue.length === 0) {
    return;
  }

  const remainingQueue = [];

  for (const { url, data } of retryQueue) {
    try {
      await httpService.post(url, data);
    } catch (error) {
      remainingQueue.push({ url, data });
    }
  }

  await AsyncStorage.setItem(RETRY_QUEUE_KEY, JSON.stringify(remainingQueue));
}

export async function get(url: string) {
  const response = await httpService.get(url);
  return response.data;
}

export async function post(url: string, data: object) {
  const response = await httpService.post(url, data);
  return response.data;
}

export async function login(url: string, credentials: object) {
  if (false) {
    return loginData(authData);
  }
  const response = await axios.post(url, credentials); // No token in headers
  const { access_token } = response.data;
  await AsyncStorage.setItem(AUTH_TOKEN_KEY, access_token);
  return loginData(response.data);
}

export async function logout() {
  axios
    .delete("")
    .then((response) => {
      console.log("LOG OUT SUCCESS");
    })
    .catch((err) => {
      console.log("ERROR on logout: ", err);
    });
}

export async function resetPassword(userId: string) {
  return await axios.post("", { userId });
}

export async function getMasterData(url: string) {
  if (false) {
    return masterDataModel(
      rmpmmasterData.rm_data,
      rmpmmasterData.pm_data,
      rmpmmasterData.vendor_list
    );
  }
  const [rmData, laminateData, cartonData, vendorList] = await Promise.all([
    getWithoutCache(
      "https://haldirams-beta-backend.toystack.dev/api/products/rm"
    ),
    getWithoutCache(
      "https://haldirams-beta-backend.toystack.dev/api/products/pm/laminate"
    ),
    getWithoutCache(
      "https://haldirams-beta-backend.toystack.dev/api/products/pm/carton"
    ),
    getWithoutCache("https://haldirams-beta-backend.toystack.dev/api/vendors"),
  ]);
  console.log(vendorList,'list')
  return masterDataModel(rmData, laminateData, cartonData, vendorList);
}

export async function submitTruckDetails(isRM: boolean, data: object) {
  try {
    const URL = isRM
      ? "https://haldirams-beta-backend.toystack.dev/rmpm/rm-inspections/"
      : "https://haldirams-beta-backend.toystack.dev/rmpm/pm-inspections/";
    await axios.post(URL, data);
  } catch (error) {
    console.log(error);
  }
}

export async function deleteTruck(truckId: any) {
  try {
    await axios.delete(
      `https://haldirams-beta-backend.toystack.dev/api/initalRMPMView/${truckId}/`
    );
  } catch (error) {
    console.log(error);
  }
}

export async function getRMPMHistory() {
  const [rmData, pmData] = await Promise.all([
    getWithoutCache(
      "http://haldirams-beta-backend.toystack.dev/rmpm/rm-inspections/get_history/"
    ),
    getWithoutCache(
      "http://haldirams-beta-backend.toystack.dev/rmpm/pm-inspections/get_history/"
    ),
  ]);
  return rmpmHistoryModel(rmData, pmData);
}

export async function getIPQCProductHistory(ids: any) {
  const response = await axios.post(
    "http://haldirams-beta-backend.toystack.dev/api/qc-form-inspection/history/",
    { product_ids: ids }
  );
  return qcHistoryModel(response.data);
}

export async function getPackaginMasterData(url: string) {
  return masterData;
}

export async function getIPQCProductMasterData(url: string) {
  if (false) {
    return ipQCMasterData;
  }
  return getWithoutCache(
    "https://haldirams-beta-backend.toystack.dev/api/products/fp"
  );
}

export async function saveIPQCForm(data: object) {
  try {
    await axios.post(
      "https://haldirams-beta-backend.toystack.dev/api/qc-form-inspection/",
      data
    );
  } catch (error) {
    console.log(error);
  }
}

export async function startRMPM(url: string, data: object) {
  if (false) {
    return {
      rm_initials: [
        {
          id: 76,
          truck_number: "A121",
          is_rm: true,
          status: "Incomplete",
          user: 1,
          shift: 3,
          plant: 1,
          city: 1,
          products: [1, 2],
        },
      ],
      pm_initials: [
        {
          id: 77,
          truck_number: "A1",
          is_rm: false,
          status: "Incomplete",
          user: 1,
          shift: 3,
          plant: 1,
          city: 1,
          products: [156, 157],
        },
      ],
    };
  }
  const response = await axios.post(
    "https://haldirams-beta-backend.toystack.dev/api/initalRMPMView/",
    data
  );
  return response.data;
}

export async function getResampledTrucks() {
  try {
    // const response = await axios.get(
    //   "https://haldirams-beta-backend.toystack.dev//api/initalRMPMView/get_resampled_inspections/"
    // );
    // return response.data;
    const [rmData, pmData] = await Promise.all([
      getWithoutCache(
        "http://haldirams-beta-backend.toystack.dev/rmpm/rm-inspections/get_history/"
      ),
      getWithoutCache(
        "http://haldirams-beta-backend.toystack.dev/rmpm/pm-inspections/get_history/"
      ),
    ]);
    return rmpmResampleModel(rmData, pmData, false);
  } catch (error) {
    return {
      rm_inspections: [],
      pm_inspections: [],
    };
  }
}
export async function getUsers(url: string) {
  try {
    const users = await getWithCache(
      "https://haldirams-beta-backend.toystack.dev/api/users"
    );
    return users;
  } catch (error) {
    return [];
  }
}
export async function getDepartments(url: string) {
  try {
    
    const departments = await getWithoutCache(
      "http://haldirams-beta-backend.toystack.dev/api/departments/"
    );
    // console.log(departments,'deparments')
    return departments;
  } catch (error) {
    console.log(error,'error in departments')
  }
}

export async function getDepartmentMachines(ids: string[]) {
  try {
   
    const queryParams = ids.join("&department_ids=");
    if (false) {
      await asyncTimeout(2000);
      return packagingModel(departmentMasterData);
    }

 
  
    const departments = await getWithoutCache(
      `http://haldirams-beta-backend.toystack.dev/api/departments/machines-products/?department_ids=${queryParams}`
    );
    return packagingModel(departments);
  } catch (error) {
    console.log(error);
  }
}


export async function getDepartmentMachines2(ids:any) {
  try {
   
    

 
  
    const departments = await getWithoutCache(
      `http://haldirams-beta-backend.toystack.dev/api/departments/machines-products/?department_ids=${ids}`
    );
    return departments;
  } catch (error) {
    console.log(error);
  }
}

export async function savePackagingCertification(data: object) {
  try {
    await axios.post(
      "https://haldirams-beta-backend.toystack.dev/api/certification-packaging/",
      data
    );
  } catch (error) {
    console.log(error);
  }
}

export async function savePackagingLekageData(data: object) {
  try {
    await axios.post(
      "https://haldirams-beta-backend.toystack.dev/api/leakage-forms/",
      data
    );
  } catch (error) {
    console.log(error);
  }
}

export async function markEndShift(data: object) {
  try {
    await axios.post(
      "https://haldirams-beta-backend.toystack.dev/api/user-shifts/end_shift/",
      data
    );
  } catch (error) {
    console.log(error);
  }
}

export function initializeRetryMechanism() {
  setInterval(retryFailedRequests, 60000);
}

export const asyncTimeout = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};
