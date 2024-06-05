export function escapeParse(message: string) {
  return message
  .replace(/\n/g, '<br />')
  .replace(/\t/g, '&emsp;')
}
