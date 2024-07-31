import { marked } from 'marked';

export function escapeParse(message: string) {
  return message
  .replace(/\n/g, '<br />')
  .replace(/\t/g, '&emsp;')
}

export function parseMarkDown(message: string) {
  message = message.replace(/\*\*[ ]+/g, "**");
  return marked.parse(message) as string;
}

export function parseJSONToTable(data: any[]) {

  const tableDom = document.createElement('table');
  const header = document.createElement('tr');
  const fields: string[] = [];
  let sourceIndex = -1;

  Object.keys(data[0]).forEach((key, index) => {
    fields.push(key);
    if(key.toLowerCase() === "source")
      sourceIndex = index;

    const heading = document.createElement('th');
    heading.innerText = key;
    header.appendChild(
      heading
    )
  })

  tableDom.appendChild(header);

  data.forEach(record => {
    const row = document.createElement('tr');
    fields.forEach((field, index) => {
      const td = document.createElement('td');
      td.innerText = record[field];
      row.appendChild(td);
      if(index === sourceIndex) {
        td.dataset.source="true"
        td.classList.add("cursor-pointer");
        td.classList.add("underline")
      }
    })
    tableDom.appendChild(row);
  })
  const div = document.createElement('div');
  div.appendChild(tableDom);
  return div.innerHTML;
}