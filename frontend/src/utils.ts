

export const generateUniqueFileName= (fileName:string)=> {
  return `${new Date().getTime()}-${fileName}`
}