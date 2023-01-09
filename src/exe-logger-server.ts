import * as net from 'net';
import {Server, Socket} from 'net';
import {ExeLoggerTagged} from './exe-logger-tagged';
import {Writable} from 'stream';
import {Console} from 'console';

export class ExeLoggerServer extends Writable {

    private index: number = 0;
    private sockets: { [key: string]: Socket } = {}
    private history: any[] = [];

    public constructor(
        private readonly historySize: number = 10000
    ) {
        super();
    }

    public start(port: number = 5002): void {
        // Create console output builder
        const out: Console = new Console(this);
        // Add output target to Exe Logger
        ExeLoggerTagged.addTarget((prefix, ...parameters) => out.log(prefix, ...parameters));
        // Build server
        const server: Server = net.createServer(async (socket) => {
            const connectionId: string = `${socket.remoteAddress}/index-${this.index++}`;
            try {
                await this.sendHistory(socket);
            } catch(error){
                console.log(error);
                return;
            }
            this.sockets[connectionId] = socket;
            socket.on('error', () => this.disconnect(connectionId));
            socket.on('end', () => this.disconnect(connectionId));
            out.log('New client connected: ', connectionId);
        });
        server.on('error', (error) => {
            console.warn('Exe Logger socket error: ', error);
        })
        server.listen(port, () => {
            console.log('Exe Logger running on port: ', port);
        });
    }

    private disconnect(connectionId: string): void {
        if (!this.sockets[connectionId]) {
            return; // Socket already deleted
        }
        this.sockets[connectionId].end();
        this.sockets[connectionId].destroy();
        delete this.sockets[connectionId];
    }

    private async sendHistory(socket: Socket): Promise<void> {
        for (const item of this.history) {
            await new Promise<void>((resolve, reject) => {
                socket.write(item, (error: Error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                });
            })
        }
    }

    public _write(chunk: any, encoding: BufferEncoding, callback: (error?: (Error | null)) => void) {
        this.history.push(chunk);
        while (this.history.length > this.historySize) {
            this.history.shift();
        }
        for (const connectionId of Object.keys(this.sockets)) {
            this.sockets[connectionId].write(chunk, (error: any) => {
                if (error) {
                    this.disconnect(connectionId);
                }
            })
        }
        callback();
    }
}
