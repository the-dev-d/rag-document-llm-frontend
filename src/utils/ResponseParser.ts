export function escapeParse(message: string) {
  return message
  .replace(/\n/g, '<br />')
  .replace(/\t/g, '&emsp;')
}

export function parseJSONToTable(data: any[]) {

  const tableDom = document.createElement('table');
  const header = document.createElement('tr');
  const fields: string[] = [];

  Object.keys(data[0]).forEach(key => {
    fields.push(key);
    const heading = document.createElement('th');
    heading.innerText = key;
    header.appendChild(
      heading
    )
  })
  tableDom.appendChild(header);
  data.shift();

  data.forEach(record => {
    const row = document.createElement('tr');
    fields.forEach(field => {
      const td = document.createElement('td');
      td.innerText = record[field];
      row.appendChild(td);
    })
    tableDom.appendChild(row);
  })
  const div = document.createElement('div');
  div.appendChild(tableDom);
  return div.innerHTML;
}