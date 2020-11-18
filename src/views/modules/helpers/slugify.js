function slugify(str='') {
  return str
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/"/g, '')
    .replace(/\s/g, '-')
}
