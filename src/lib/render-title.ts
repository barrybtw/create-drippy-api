import fs from 'fs/promises';
import gradient from 'gradient-string';

const poimandres_theme = {
  blue: '#add7ff',
  cyan: '#89ddff',
  green: '#5de4c7',
  red: '#d0679d',
  yellow: '#fffac2',
};

const create_drippy_api = await fs.readFile('./src/lib/ascii.txt', 'utf-8');

export const render_title = () => {
  const gradient_string = gradient(Object.values(poimandres_theme));
  console.log(gradient_string.multiline(create_drippy_api));
};
