import axios from "axios";
import { Customer } from "../types/customer";
import API_URL from "./apiUrl";

export const customerApi = {
  createCustomer: async (name: string): Promise<Customer> => {
    const response = await axios.post(`${API_URL}/customers`, { name });
    return response.data;
  },

  getAllCustomers: async (): Promise<Customer[]> => {
    const response = await axios.get(`${API_URL}/customers`);
    return response.data;
  },
};
