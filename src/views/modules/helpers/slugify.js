import slugify from 'slugify'

export default function slug (str = '') {
  return slugify(str, {
    lower: true,
    remove: /[*+~()'"!?:@]/g
  })
}
