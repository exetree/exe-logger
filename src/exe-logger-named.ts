import {ExeLoggerTagged} from './exe-logger-tagged';

export class ExeLoggerNamed extends ExeLoggerTagged {

    public constructor(tag: string, name: string) {
        super(tag, name);
    }

    public getName(): string {
        return this.name!;
    }

}
