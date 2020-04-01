// Found on: https://medium.com/@mhagemann/the-ultimate-way-to-slugify-a-url-string-in-javascript-b8e4a0d849e1
// Special Characters
const a =
  'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;';
// Characters to replace them with
const b =
  'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------';
const p = new RegExp(a.split('').join('|'), 'g');

export const slugify = (string: string) => {
  return string
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with '-'
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, '-and-') // Replace "&" with "-and-"
    .replace(/[^\w\-]+/g, '') // Remove non-word characters
    .replace(/\-\-+/g, '-'); // Replace multiple "-" with single "-"
};
