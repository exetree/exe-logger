import {Socket} from 'net';

export class ExeLoggerClient {
    private buffer: Buffer = Buffer.alloc(0);

    public constructor(
        private readonly host: string,
        private readonly port: number,
    ) {

    }

    public connect(): void {
        const socket: Socket = new Socket();
        socket.connect(this.port, this.host, () => console.log('Exe logger client connected.'));
        socket.on('data', (data) => this.onData(data));
        socket.once('error', (error) => console.warn('Exe logger client error: ', error));
        socket.once('end', () => console.warn('Exe logger server was closed.'));
    }

    private onData(data: Buffer): void {
        this.buffer = Buffer.concat([this.buffer, data]);
        while (true) {
            const endOfLine: number = this.buffer.indexOf('\n');
            if (endOfLine === -1) {
                break;
            }
            console.log(this.buffer.slice(0, endOfLine).toString('ascii'));
            this.buffer = this.buffer.slice(endOfLine + 1);
        }
    }
}
