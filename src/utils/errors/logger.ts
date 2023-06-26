import { format, createLogger, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const { combine, timestamp, label, printf, prettyPrint } = format;
let CATEGORY = "file-upload-service: custom log";

// Daily Rolate File
const fileRotateTransport = new DailyRotateFile({
  level: "error",
  filename: "logs/application-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true /* zip the previous log */,
  maxSize: "2M" /* 2MB */,
  maxFiles: "30d" /* keep all archive files for 30days */
});

// Logger Config
const logger = createLogger({
  level: "error",
  format: combine(
    label({ label: CATEGORY }),
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss"
    }),
    prettyPrint()
  ),
  transports: [fileRotateTransport]
});

export default logger;
