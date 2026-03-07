// import { io } from "socket.io-client";

// const socket = io("http://localhost:5000", {
//   withCredentials: true
// });

// export default socket;



import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SOCKET_URL, {
  withCredentials: true
});

export default socket;
