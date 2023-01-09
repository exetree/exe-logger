import {ExeLoggerLevel} from './exe-logger-level';
import {ExeLoggerSpec} from './exe-logger-spec';

/**
 * This is the main class off this library.
 */
export class ExeLoggerTagged {

    /**
     * This field can be used to enable/disable logging.
     */
    public static enabled = true;
    /**
     * The log information can be targeted to other output, so console output can be
     * disabled to prevent unnecessary log output.
     */
    public static useConsole = true;

    /**
     * This method can be used to add the target to which the output data (messages) will be sent.
     *
     * @param target
     * @param levels
     */
    public static addTarget(
        target: (message: string, ...parameters: any[]) => void, ...levels: ExeLoggerLevel[]
    ): void {
        if (!levels || !levels.length) {
            levels = Object.values(ExeLoggerLevel) as ExeLoggerLevel[];
        }
        for (const level of levels) {
            if (!ExeLoggerTagged.targets[level]) {
                ExeLoggerTagged.targets[level] = [];
            }
            ExeLoggerTagged.targets[level].push(target);
        }
    }

    /**
     * This method can be used to add the target to which the output data (messages) will be sent. Raw prefix (not colored)
     *
     * @param target
     * @param levels
     */
    public static addTargetRaw(
        target: (message: string, ...parameters: any[]) => void, ...levels: ExeLoggerLevel[]
    ): void {
        if (!levels || !levels.length) {
            levels = Object.values(ExeLoggerLevel) as ExeLoggerLevel[];
        }
        for (const level of levels) {
            if (!ExeLoggerTagged.targetsRaw[level]) {
                ExeLoggerTagged.targetsRaw[level] = [];
            }
            ExeLoggerTagged.targetsRaw[level].push(target);
        }
    }

    /**
     * This method used to specify the level for the tag, or the global level if the tag isn't specified.
     *
     * @param level
     * @param tag
     */
    public static setLevel(level: ExeLoggerLevel, tag?: string): void {
        if (tag && tag.trim().length) {
            ExeLoggerTagged.levels[tag] = level;
        } else {
            ExeLoggerTagged.mainLevel = level;
        }
    }

    public static setLevels(levels: { main: ExeLoggerLevel, levels: { [key: string]: ExeLoggerLevel } }) {
        this.mainLevel = levels.main;
        this.levels = levels.levels;
    }

    public static getLevels(): { main: ExeLoggerLevel, levels: { [key: string]: ExeLoggerLevel } } {
        return {
            main: this.mainLevel,
            levels: this.levels,
        }
    }

    /**
     * List of targets where the output messages will be send.
     */
    private static targets: { [key: string]: ((message: string, ...parameters: any[]) => void)[] } = {};

    /**
     * List of targets where the output messages will be send. Raw prefix (not colored).
     */
    private static targetsRaw: { [key: string]: ((message: string, ...parameters: any[]) => void)[] } = {};
    /**
     * Tags mapping to the level to detect what level messages should be send for the defined tags.
     */
    private static levels: { [key: string]: ExeLoggerLevel } = {};
    /**
     * The global level that is used if there is no level specified for the tag.
     */
    private static mainLevel: ExeLoggerLevel = ExeLoggerLevel.INFO;

    /**
     * Send the messages to the targets.
     *
     * @param level
     * @param prefix
     * @param parameters
     * @private
     */
    private static sendToTargets(level: ExeLoggerLevel, prefix: string, ...parameters: any[]): void {
        if (ExeLoggerTagged.targets[level] && ExeLoggerTagged.targets[level].length) {
            for (const target of ExeLoggerTagged.targets[level]) {
                target(prefix, ...parameters);
            }
        }
    }

    /**
     * Send the messages to the targets. Raw prefix (not colored).
     *
     * @param level
     * @param prefix
     * @param parameters
     * @private
     */
    private static sendToTargetsRaw(level: ExeLoggerLevel, prefix: string, ...parameters: any[]): void {
        if (ExeLoggerTagged.targetsRaw[level] && ExeLoggerTagged.targetsRaw[level].length) {
            for (const target of ExeLoggerTagged.targetsRaw[level]) {
                target(prefix, ...parameters);
            }
        }
    }

    /**
     * Create the instance of the object that will be used to do the logging.
     *
     * @param tag
     * @param name
     * @param level
     */
    public constructor(
        protected readonly tag: string,
        protected readonly name?: string,
        level?: ExeLoggerLevel,
    ) {
        if (level) {
            ExeLoggerTagged.setLevel(level, tag);
        }
    }

    /**
     * Log the severe message
     *
     * @param messages
     */
    public severe(...messages: any[]): void {
        if (!ExeLoggerTagged.enabled) {
            return; // LOG is disabled
        }
        if (
            (ExeLoggerTagged.levels[this.tag] && ExeLoggerTagged.levels[this.tag] >= ExeLoggerLevel.SEVERE)
            || (!ExeLoggerTagged.levels[this.tag] && ExeLoggerTagged.mainLevel >= ExeLoggerLevel.SEVERE)
        ) {
            const prefixRaw = this.formatPrefix('SEVERE');
            const prefix = ExeLoggerSpec.FG_RED + prefixRaw + ExeLoggerSpec.RESET;
            messages = this.format(...messages);
            if (ExeLoggerTagged.useConsole) {
                console.error(prefix, ...messages);
            }
            ExeLoggerTagged.sendToTargets(ExeLoggerLevel.SEVERE, prefix, ...messages);
            ExeLoggerTagged.sendToTargetsRaw(ExeLoggerLevel.SEVERE, prefixRaw, ...messages);
        }
    }

    /**
     * Log the warning message
     *
     * @param messages
     */
    public warn(...messages: any[]): void {
        if (!ExeLoggerTagged.enabled) {
            return; // LOG is disabled
        }
        if (
            (ExeLoggerTagged.levels[this.tag] && ExeLoggerTagged.levels[this.tag] >= ExeLoggerLevel.WARNING)
            || (!ExeLoggerTagged.levels[this.tag] && ExeLoggerTagged.mainLevel >= ExeLoggerLevel.WARNING)
        ) {
            const prefixRaw = this.formatPrefix('WARN  ');
            const prefix = ExeLoggerSpec.FG_YELLOW + prefixRaw + ExeLoggerSpec.RESET;
            messages = this.format(...messages);
            if (ExeLoggerTagged.useConsole) {
                console.warn(prefix, ...messages);
            }
            ExeLoggerTagged.sendToTargets(ExeLoggerLevel.WARNING, prefix, ...messages);
            ExeLoggerTagged.sendToTargetsRaw(ExeLoggerLevel.WARNING, prefixRaw, ...messages);
        }
    }

    /**
     * Log the info message
     *
     * @param messages
     */
    public info(...messages: any[]): void {
        if (!ExeLoggerTagged.enabled) {
            return; // LOG is disabled
        }
        if (
            (ExeLoggerTagged.levels[this.tag] && ExeLoggerTagged.levels[this.tag] >= ExeLoggerLevel.INFO)
            || (!ExeLoggerTagged.levels[this.tag] && ExeLoggerTagged.mainLevel >= ExeLoggerLevel.INFO)
        ) {
            const prefixRaw = this.formatPrefix('INFO  ');
            const prefix = ExeLoggerSpec.FG_BLUE + prefixRaw + ExeLoggerSpec.RESET;
            messages = this.format(...messages);
            if (ExeLoggerTagged.useConsole) {
                console.log(prefix, ...messages);
            }
            ExeLoggerTagged.sendToTargets(ExeLoggerLevel.INFO, prefix, ...messages);
            ExeLoggerTagged.sendToTargetsRaw(ExeLoggerLevel.INFO, prefixRaw, ...messages);
        }
    }

    /**
     * Log the debug message
     *
     * @param messages
     */
    public debug(...messages: any[]): void {
        if (!ExeLoggerTagged.enabled) {
            return; // LOG is disabled
        }
        if (
            (ExeLoggerTagged.levels[this.tag] && ExeLoggerTagged.levels[this.tag] >= ExeLoggerLevel.DEBUG)
            || (!ExeLoggerTagged.levels[this.tag] && ExeLoggerTagged.mainLevel >= ExeLoggerLevel.DEBUG)
        ) {
            const prefixRaw = this.formatPrefix('DEBUG ');
            const prefix = ExeLoggerSpec.FG_CYAN + prefixRaw + ExeLoggerSpec.RESET;
            messages = this.format(...messages);
            if (ExeLoggerTagged.useConsole) {
                console.log(prefix, ...messages);
            }
            ExeLoggerTagged.sendToTargets(ExeLoggerLevel.DEBUG, prefix, ...messages);
            ExeLoggerTagged.sendToTargetsRaw(ExeLoggerLevel.DEBUG, prefixRaw, ...messages);
        }
    }

    /**
     * Log the debug message
     *
     * @param messages
     */
    public drown(...messages: any[]): void {
        if (!ExeLoggerTagged.enabled) {
            return; // LOG is disabled
        }
        if (
            (ExeLoggerTagged.levels[this.tag] && ExeLoggerTagged.levels[this.tag] >= ExeLoggerLevel.DROWN)
            || (!ExeLoggerTagged.levels[this.tag] && ExeLoggerTagged.mainLevel >= ExeLoggerLevel.DROWN)
        ) {
            const prefixRaw = this.formatPrefix('DROWN ');
            const prefix = ExeLoggerSpec.FG_BLACK + prefixRaw + ExeLoggerSpec.RESET;
            messages = this.format(...messages);
            if (ExeLoggerTagged.useConsole) {
                console.log(prefix, ...messages);
            }
            ExeLoggerTagged.sendToTargets(ExeLoggerLevel.DROWN, prefix, ...messages)
            ExeLoggerTagged.sendToTargetsRaw(ExeLoggerLevel.DROWN, prefixRaw, ...messages)
        }
    }

    private formatPrefix(levelName: string): string {
        return `[${new Date().toISOString()}][${levelName}][${this.tag}${this.name ? '|' + this.name : ''}]`
    }

    protected format(...messages: any[]) {
        return messages;
    }
}
