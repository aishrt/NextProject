import Axios from "axios";

export const axios = Axios.create();

axios.interceptors.response.use(
    (response) => {
        return response.data.data;
    }
);
