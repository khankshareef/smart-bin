import axios from "axios";

const Base_Url = import.meta.env.VITE_API_URL;

// 1. Create axios instance
const api = axios.create({
  baseURL: Base_Url,
  headers: {
    "Content-Type": "application/json",
    // CRITICAL: This bypasses the ngrok landing page warning (ERR_NGROK_6024)
    "ngrok-skip-browser-warning": "true",
  },
});

// 2. Add a Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Add a Response Interceptor (Handles Global Errors)
api.interceptors.response.use(
  (response) => {
    // Return successful response
    return response;
  },
  (error) => {
    // Case 1: Network Error / Server is Down (No response object)
    if (!error.response) {
      console.error("Network error or server unreachable");
      window.location.href = "/network-error";
      return Promise.reject(error);
    }

    // const { status } = error.response;

    // Case 2: Unauthorized (Token expired or invalid)
    // if (status === 401) {
    //   window.location.href = "/404";
    // }

    // Case 3: Internal Server Error
    // else if (status === 500) {
    //   window.location.href = "/500";
    // }

    // Case 4: Forbidden or Page Not Found (Optional)
    // else if (status === 404) {
      // You can choose to redirect to 404 here or handle it in the component
    //   window.location.href = "/404";
    // }

    return Promise.reject(error);
  }
);


export const bin_dashboard_create = (data) => {
  return api.post('/bin/',data)
}

export const bin_dashboard_getById = (id) => {
  return api.get(`/bin/${id}`)
}

export const bin_dashboard_deleteById = (id) => {
  return api.delete(`/bin/${id}`)
}


export const bin_dashboard_Edit = (id,data) => {
  return api.put(`/bin/${id}`,data)
}

export const bin_customerName_get = () => {
  return api.get('/customer-master/')
}

export const bin_ProjectName_get = (customerId) => {
  return api.get(`/project/by-customer/${customerId}`)
}

export const bin_item_master_get = () => {
  return api.get('/item-master/')
}

export const bin_dashboard_get = (page = 1, limit = 10)  => {
  return api.get('/bin/',{
    params: { page, limit }
  })
}

export const customer_id = () => {
  return api.get('/customer-master/get/all');
}

// ✅ Correct API with query params
export const get_warehouse_byId = (customerId, itemMasterId) => {
  return api.get('/warehouse/by-item', {
    params: { customerId, itemMasterId }
  });
};


///////////////////////////////////////////////////////////////////////////////////SmartBin-Dashboard //////////////////////////////////////////////////////////////////////////

export const smartbinDashboard_getall = (page = 1, limit = 10) => {
  return api.get('/bin-dashboard/dashboard/',{
    params: { page, limit }
  })
}

// Ensure 'payload' is passed into the post method
export const smartbinDashboard_create = (payload) => {
  return api.post('/bin-dashboard/iot/update/', payload);
};


export const binDashboard_dynamicGet = (page = 1, limit = 10) => {
  return api.get('/bin-dashboard/iot/live-status/', {
    params: { page, limit }
  });
}

export const bindashboard_moreView = (customerMasterId, itemMasterId) => {
  return api.get(`/warehouse/transation?itemMasterId=${itemMasterId}&customerId=${customerMasterId}`)
}

