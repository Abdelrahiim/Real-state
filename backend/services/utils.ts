import {faker} from "@faker-js/faker";

export function getUserNameFromDisplayName(name:string){
  const namedArray = name.toLowerCase().split(" ")
  return faker.internet.displayName({firstName: namedArray[0], lastName: namedArray[1]})
}