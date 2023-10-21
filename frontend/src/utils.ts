

export const generateUniqueFileName= (fileName:string)=> {
  return `${new Date().getTime()}-${fileName}`
}

export function isHTMLTextAreaElement(element: any): element is HTMLTextAreaElement {
  return element instanceof HTMLTextAreaElement;
}
export function isHTMLSelectElement(element: any): element is HTMLSelectElement {
  return element instanceof HTMLSelectElement;
}