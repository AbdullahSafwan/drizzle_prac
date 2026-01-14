function getDebugInfo() {
  try {
    throw new Error();
  } catch (e) {
    const error = e instanceof Error ? e : new Error(String(e));
    const stackLines = error.stack?.split("\n") || [];
    // Assuming that the third line of the stack trace contains the file and line information
    const callerLine = stackLines[3] || "";
    // const matchResult = callerLine.match(/at (.+?) \((.+?):(\d+):(\d+)\)/);
    if (callerLine) {
      return {
        // functionName: matchResult[1],
        // fileName: matchResult[2],
        // lineNumber: matchResult[3],
        errorLocation: callerLine,
      };
    } else {
      return {
        // functionName: 'UnknownFunction',
        // fileName: 'UnknownFile',
        // lineNumber: 'UnknownLine',
        errorLocation: "UnknownLocation",
      };
    }
  }
}

// Create a wrapper function for debugLog with debug information
export function debugLog(...args: unknown[]) {
  const { errorLocation } = getDebugInfo();
  console.log(`${errorLocation}`, ...args);
}
