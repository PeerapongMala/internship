type LogLevel = "debug" | "log" | "warn" | "error";

function getCaller(line: number = 2): any { // Default to 2 to skip the line of sting Error and getCallerName
    // Extract caller from stack trace
    const stack = new Error().stack;
    const callerLines = stack?.split("\n") || [];
    const callerLine = callerLines[line]?.trim();
    const callerName = callerLine.split(" (")[0];
    const caller = callerName || "anonymous";
    return caller;
}

function getCallerName(): any {
    const caller = getCaller(1); // [1] → skip lines of string Error + getCallerName
    return caller;
}

function getCallerMessage(message: any, ...optional: any[]): any {
    const caller = getCaller(3); // [1] → skip lines of string Error + getCallerName + getLog
    const stack = new Error().stack ;
    const arr = optional;
    arr.unshift(stack);
    return {caller, message, arr};
}

export const logger = {
    getCallerMessage,
    getCallerName,
};
