export class ExeLoggerHex {
    public static fromByte(byte: number): string {
        return `${byte.toString(16).padStart(2, '0')}`;
    }

    public static fromIntBE(int: number): string {
        const buffer: Buffer = Buffer.alloc(4);
        buffer.writeUInt32BE(int, 0);
        return `${ExeLoggerHex.fromBytes(buffer).join('')}`;
    }

    public static fromBytes(bytes: ArrayLike<number>): string[] {
        const strings: string[] = [];
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < bytes.length; i++) {
            strings.push(bytes[i].toString(16).padStart(2, '0'));
        }
        return strings;
    }
}
