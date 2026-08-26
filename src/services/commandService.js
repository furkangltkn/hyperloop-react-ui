import axios from "axios";

const API_URL = "http://localhost:5120/api/command";

export const sendCommand = async (command) => {
  const response = await axios.post(API_URL, {
    command: command,
    source: "UI",
    timestamp: new Date().toISOString()
  });
  return response.data;
};
