import gradient from 'gradient-string';

const poimandres_theme = {
  blue: '#add7ff',
  cyan: '#89ddff',
  green: '#5de4c7',
  red: '#d0679d',
  yellow: '#fffac2',
};

const create_drippy_api = await fetch(
  'https://gist.githubusercontent.com/barrybtw/224c6345f069463b849dc9acc33e4a08/raw/14e36aec99e4fdd353b75ea5e2a0ad09770afeb1/ascii.txt',
).then((res) => res.text());

export const render_title = () => {
  const gradient_string = gradient(Object.values(poimandres_theme));
  console.log(gradient_string.multiline(create_drippy_api));
};
