import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatData(summary: string, contents: any) {

  let str=""
  str+=`Summary: ${summary}\n`
  str+=`Contents:\n`
  contents.forEach((content: any) => {
    str+=`#${content.path}\n${content.content}\n`
  })
  return str
}