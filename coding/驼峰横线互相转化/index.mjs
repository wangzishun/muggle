export const _camelCase2KebabCase = (camelCase) => {
  return camelCase.replace(/([A-Z])/g, (match) => `-${match.toLowerCase()}`)
}

export const _kebabCase2CamelCase = (kebabCase) => {
  return kebabCase.replace(/-([a-z0-9])/g, (match, p1) => p1.toUpperCase())
}

export const _kebabCase2PascalCase = (kebabCase) => {
  return kebabCase.replace(/(^\w)|-(\w)/g, (match, p1, p2) => {
    if (p1) return p1.toUpperCase()
    if (p2) return p2.toUpperCase()
  })
}

export const _kebabCase2CamelCaseByArray = (kebabCase) => {
  return kebabCase
    .split('-')
    .map((item, index) => {
      if (index === 0) return item
      return item[0].toUpperCase() + item.slice(1)
    })
    .join('')
}
