import {ExeLoggerLevel} from './exe-logger-level';
import {ExeLoggerSpec} from './exe-logger-spec';
import * as readline from 'readline';
import * as path from 'path';
import {ExeLoggerTagged} from './exe-logger-tagged';
import * as fs from 'fs';

/**
 * This class extends the main logging class to add functionality available on back-end.
 */
export class ExeLogger extends ExeLoggerTagged {

    public static loadConfig(): void {
        const LOG: ExeLoggerTagged = new ExeLoggerTagged('EXE LOGGER CONFIGURATION')
        if (fs.existsSync('logging.json')) {
            LOG.info(`Loading logging configuration...`);
            const data: Buffer = fs.readFileSync('logging.json');
            const conf: { [key: string]: string } = JSON.parse(data.toString('utf-8'));
            for (const tag of Object.keys(conf)) {
                // @ts-ignore
                LOG.info(`${conf[tag]}(${ExeLoggerLevel[conf[tag]]}) : ${tag}`)
                // @ts-ignore
                ExeLoggerTagged.setLevel(ExeLoggerLevel[conf[tag]], tag);
            }
            LOG.info('End of configuration load.')
        } else {
            LOG.info('Logging configuration not found.');
        }
    }

    /**
     * Create an instance of the logger that tag is parsed from the file path.
     *
     * @param filePath
     * @param level
     */
    public constructor(
        filePath: string,
        level?: ExeLoggerLevel
    ) {
        super(path.basename(filePath, '.js'), undefined, level);
    }

    /**
     * Display the progress on the console output.
     *
     * @param percentage
     */
    public progress(percentage: number): void {
        if (!ExeLogger.enabled) {
            return; // LOG is disabled
        }
        percentage = Math.floor(percentage);
        const prefix = ExeLoggerSpec.FG_RED
            + '[progress][' + this.tag + '] '
            + ExeLoggerSpec.RESET;
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(prefix);
        process.stdout.write(percentage + '%');
        if (percentage === 100) {
            process.stdout.write('\n');
        }
    }

    protected format(...messages: any[]) {
        const formatted: any[] = [];
        for (const message of messages) {
            if (Buffer.isBuffer(message)) {
                let position: number = 0;
                let nextPosition: number = 0;
                let exploded: Buffer[] = [];
                while (position < message.length) {
                    nextPosition = position + 30 < message.length ? position + 30 : message.length;
                    exploded.push(message.slice(position, nextPosition))
                    position = nextPosition;
                }
                formatted.push(exploded);
            } else {
                formatted.push(message);
            }
        }
        return formatted;
    }
}
