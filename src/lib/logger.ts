import chalk from 'chalk';
export const logger = {
  info(...args: unknown[]) {
    console.log(chalk.blue('INFO:', ...args));
  },
  error(...args: unknown[]) {
    console.log(chalk.red('ERROR:', ...args));
  },
  warn(...args: unknown[]) {
    console.log(chalk.yellow('WARN:', ...args));
  },
  success(...args: unknown[]) {
    console.log(chalk.green('SUCCESS:', ...args));
  },
};
