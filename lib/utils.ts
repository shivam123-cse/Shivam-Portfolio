export function cn(...inputs: any[]) {
  const classes: string[] = []
  for (const input of inputs) {
    if (!input) continue
    if (typeof input === "string") {
      classes.push(input)
    } else if (Array.isArray(input)) {
      classes.push(...input.filter(Boolean))
    } else if (typeof input === "object") {
      for (const [key, value] of Object.entries(input)) {
        if (value) classes.push(key)
      }
    }
  }
  return classes.join(" ")
}

export default cn
