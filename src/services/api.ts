import axios from "axios";
import Cookies from 'js-cookie';

const token = Cookies.get('@dowhile:token');

export const api = axios.create({
  baseURL: "http://localhost:4000",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
