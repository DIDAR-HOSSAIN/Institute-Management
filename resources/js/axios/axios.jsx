import axios from "axios";

const axiosApi = axios.create({
    baseURL: "https://bashiriamadrasha-exstudents.com/",
    headers: {
        "X-CSRF-TOKEN": document
            .querySelector('meta[name="csrf-token"]')
            .getAttribute("content"),
        "Content-Type": "application/json",
    },
});

export default axiosApi;


// const axiosApi = axios.create({
//     baseURL: "http://localhost:8000/",
//     headers: {
//         "X-CSRF-TOKEN": document
//             .querySelector('meta[name="csrf-token"]')
//             .getAttribute("content"),
//         "Content-Type": "application/json",
//     },
// });

// export default axiosApi;