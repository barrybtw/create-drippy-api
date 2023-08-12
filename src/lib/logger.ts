import chalk from 'chalk';
export const logger = {
  info(...args: unknown[]) {
    console.log(chalk.blue('INFO:', ...args));
  },
  error(...args: unknown[]) {
    console.log(chalk.red('ERROR:', ...args));
  },
};
