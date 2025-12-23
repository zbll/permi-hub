export default class Console {
    private static slog;
    private static serr;
    private static swarn;
    static danger(...message: any[]): void;
    static warn(...message: any[]): void;
    static success(...message: any[]): void;
    static info(...message: any[]): void;
}
