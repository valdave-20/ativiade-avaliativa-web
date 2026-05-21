const API_URL = "http://localhost:3001";

const getToken = () => localStorage.getItem("token");

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Erro HTTP: ${response.status}`);
  }
  return response.json();
};

export const api = {
  auth: {
    login: async (email, password) => {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await handleResponse(response);
      if (data.token) localStorage.setItem("token", data.token);
      return data;
    },

    logout: () => {
      localStorage.removeItem("token");
    },
  },

  subjects: {
    list: async () => {
      const response = await fetch(`${API_URL}/subjects`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return handleResponse(response);
    },

    create: async (name) => {
      const response = await fetch(`${API_URL}/subjects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ name }),
      });
      return handleResponse(response);
    },

    delete: async (id) => {
      const response = await fetch(`${API_URL}/subjects/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return handleResponse(response);
    },
  },

  activities: {
    list: async (filters = {}) => {
      const params = new URLSearchParams(filters);
      const response = await fetch(
        `${API_URL}/activities?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      return handleResponse(response);
    },

    create: async (activity) => {
      const response = await fetch(`${API_URL}/activities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(activity),
      });
      return handleResponse(response);
    },

    delete: async (id) => {
      const response = await fetch(`${API_URL}/activities/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return handleResponse(response);
    },
  },
};