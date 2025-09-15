// backend/utils/socket.js
let ioInstance = null;

/**
 * store socket.io instance so other modules can emit events
 * setSocketIO(io) -> stores the instance
 * getSocketIO() -> returns it (or null)
 */
export const setSocketIO = (io) => {
  ioInstance = io;
};

export const getSocketIO = () => ioInstance;
