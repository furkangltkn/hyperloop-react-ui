import axios from "axios";

const API_URL = "http://localhost:5120/api/command";

export const sendCommand = async (command) => {
  return axios.post(API_URL, {
    command: command,
    source: "UI",
    timestamp: new Date().toISOString()
  });
}