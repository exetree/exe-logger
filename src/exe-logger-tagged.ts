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
            if (!this.targets[level]) {
                this.targets[level] = [];
            }
            this.targets[level].push(target);
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
            this.levels[tag] = level;
        } else {
            this.mainLevel = level;
        }
    }

    /**
     * List of targets where the output messages will be send.
     */
    private static targets: { [key: string]: Array<(message: string, ...parameters: any[]) => void> } = {};
    /**
     * Tags mapping to the level to detect what level messages should be send for the defined tags.
     */
    private static levels: { [key: string]: ExeLoggerLevel } = {};
    /**
     * The global level that is used if there is no level specified for the tag.
     */
    private static mainLevel: ExeLoggerLevel = ExeLoggerLevel.INFO;

    /**
     * Send the messages to the targets
     *
     * @param level
     * @param prefix
     * @param parameters
     * @private
     */
    private static sendToTargets(level: ExeLoggerLevel, prefix: string, ...parameters: any[]): boolean {
        if (ExeLoggerTagged.targets[level] && ExeLoggerTagged.targets[level].length) {
            for (const target of ExeLoggerTagged.targets[level]) {
                target(prefix, ...parameters);
            }
            return true;
        } else {
            return false;
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

    public getNamed(name: string): ExeLoggerTagged {
        return new ExeLoggerTagged(this.tag, name);
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
            const prefix = this.formatPrefix('SEVERE');
            if (!ExeLoggerTagged.sendToTargets(ExeLoggerLevel.SEVERE, prefix, ...messages) && ExeLoggerTagged.useConsole) {
                console.error(ExeLoggerSpec.FG_RED + prefix + ExeLoggerSpec.RESET, ...this.format(...messages));
            }
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
            const prefix = this.formatPrefix('WARN  ');
            if (!ExeLoggerTagged.sendToTargets(ExeLoggerLevel.WARNING, prefix, ...messages) && ExeLoggerTagged.useConsole) {
                console.warn(ExeLoggerSpec.FG_YELLOW + prefix + ExeLoggerSpec.RESET, ...this.format(...messages));
            }
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
            const prefix = this.formatPrefix('INFO  ');
            if (!ExeLoggerTagged.sendToTargets(ExeLoggerLevel.INFO, prefix, ...messages) && ExeLoggerTagged.useConsole) {
                console.log(ExeLoggerSpec.FG_BLUE + prefix + ExeLoggerSpec.RESET, ...this.format(...messages));
            }
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
            const prefix = this.formatPrefix('DEBUG ');
            if (!ExeLoggerTagged.sendToTargets(ExeLoggerLevel.DEBUG, prefix, ...messages) && ExeLoggerTagged.useConsole) {
                console.log(ExeLoggerSpec.FG_CYAN + prefix + ExeLoggerSpec.RESET, ...this.format(...messages));
            }
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
            const prefix = this.formatPrefix('DROWN ');
            if (!ExeLoggerTagged.sendToTargets(ExeLoggerLevel.DROWN, prefix, ...messages) && ExeLoggerTagged.useConsole) {
                console.log(ExeLoggerSpec.FG_BLACK + prefix + ExeLoggerSpec.RESET, ...this.format(...messages));
            }
        }
    }

    private formatPrefix(levelName: string): string {
        return `[${new Date().toISOString()}][${levelName}][${this.tag}${this.name ? '|' + this.name : ''}]`
    }

    protected format(...messages: any[]) {
        return messages;
    }
}
