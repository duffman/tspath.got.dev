declare enum LogLevel {
    All = 0,
    Warning = 1,
    Error = 2
}
export declare class Log {
    private static clrError;
    private static clrWarning;
    static setLogLevel(level: LogLevel): void;
    private static toDataString;
    private static compileLog;
    static warning(label: string, data?: any): void;
    static info(label: string, data?: any): void;
    static infoSummary(label: string, data?: any): void;
    static error(label: string, data?: any): void;
    static spit(): void;
    static log(logMessage: string, logData?: any): void;
    /**
     * Standard Debug Log
     *
     * @param caller - object, used to get class name
     * @param logMessage - The message to print
     * @param logData - Optional data such as data structures
     */
    static debug(caller: any, logMessage: string, logData?: any): void;
    static message(logMessage: string, logData?: any): void;
    static internalError(source: any, logMessage: string, logData?: any): void;
    static logCoreInfo(source: any, logMessage: string, logData?: any): void;
    static fatalError(errorMessage: string, error?: Error): void;
    static logErrorMessage(errorMessage: string, error?: Error): void;
    static logGreen(logMessage: string, logData?: any): void;
    static logYellow(logMessage: string, logData?: any): void;
    static logCyan(logMessage: string, logData?: any): void;
    static logBlue(logMessage: string, logData?: any): void;
    static logPurple(logMessage: string, logData?: any): void;
    static logImportant(prefix: string, logMessage: string): void;
}
export {};
