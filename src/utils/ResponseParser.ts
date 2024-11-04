export function escapeParse(message: string) {
  return message
  .replace(/\n/g, '<br />')
  .replace(/\t/g, '&emsp;')
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
export function getSelectableTextContent(div:HTMLElement) {
  if (!(div instanceof HTMLElement)) {
      throw new Error("Please provide a valid HTML element.");
  }

  let selectableText = "";

  function traverse(node:any) {
      // Only process if node is an Element
      if (node.nodeType === Node.ELEMENT_NODE) {
          const style = window.getComputedStyle(node);
          const nonSelectableTags = ["SCRIPT", "STYLE", "NOSCRIPT"];
          
          // Skip non-selectable tags and hidden elements
          if (
              nonSelectableTags.includes(node.tagName) ||
              style.visibility === "hidden" ||
              style.display === "none"
          ) {
              return;
          }
      }

      // Add text content if it's a text node
      if (node.nodeType === Node.TEXT_NODE) {
          selectableText += node.textContent;
      }

      // Traverse child nodes
      node.childNodes.forEach(traverse);
  }

  traverse(div);
  return selectableText.trim();
}
