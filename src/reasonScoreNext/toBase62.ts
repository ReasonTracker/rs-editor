

export function toBase62(num: number) {
    const base62Chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let str = '';
    while (num > 0) {
        str = base62Chars[num % 62] + str;
        num = Math.floor(num / 62);
    }
    return str;
}
