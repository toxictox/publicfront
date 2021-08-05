import axios from "axios";
const token = localStorage.getItem("accessToken");
if (token !== null) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}
export default axios;
