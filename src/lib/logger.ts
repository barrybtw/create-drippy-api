import chalk from 'chalk';
export const logger = {
  info(...args: unknown[]) {
    console.log(chalk.blue(...args));
  },
};
