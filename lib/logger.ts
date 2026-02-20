import pino from "pino";

const isProd = process.env.NODE_ENV === "production";

export const logger = pino({
    level : process.env.LOG_LEVEL,
    base : {
        service : "workflow-builder-lite",
    },
    transport : !isProd  ? {
        target : "pino-pretty",
        options : {
            colorize : true,
            translateTime : "SYS:standard",
            ignore : "pid,hostname",
        }
    } : undefined,
});