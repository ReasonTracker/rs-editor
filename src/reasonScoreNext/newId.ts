
export function newId(when: Date = new Date()): string {
  // take the UTC date and convert to base 62
  let decimal = 5000000000000 - when.getTime();
  const s = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  let result = '';
  while (decimal >= 1) {
    result = s[(decimal - (62 * Math.floor(decimal / 62)))] + result;
    decimal = Math.floor(decimal / 62);
  }

  // Add 5 extra random characters in case multiple ids are creates at the same time
  result += Array(5).join().split(',').map(() => s[(Math.floor(Math.random() * s.length))])
    .join('');

  return result ;
}