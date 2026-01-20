export function getWorkingDirectory(): string {
    // This is more reliable than process.cwd() when running via npm, pnpm
    if (process.env.INIT_CWD != null) {
        return process.env.INIT_CWD;
    }

    return process.cwd();
}
