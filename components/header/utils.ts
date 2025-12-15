export function cn(...inputs: (string | undefined | null | false | 0 | { [key: string]: any })[]) {
  return inputs
    .flat()
    .filter(x => x && typeof x !== 'boolean')
    .map(x => typeof x === 'object' ? Object.keys(x).filter(k => x[k]).join(' ') : x)
    .join(' ');
}
