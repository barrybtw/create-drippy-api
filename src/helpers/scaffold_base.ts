import path from 'path';
import chalk from 'chalk';
import fs from 'fs-extra';
import inquirer from 'inquirer';
import ora from 'ora';

import { PKG_ROOT } from '@/consts.js';
import { logger } from '@/lib/logger.js';

// This bootstraps the base Node.js application with Typescript
export const scaffold_base = async ({
  project_name,
  project_dir,
  no_install,
  pkg_manager,
}: {
  project_name: string;
  project_dir: string;
  no_install: boolean;
  pkg_manager: 'npm' | 'yarn' | 'pnpm';
}) => {
  const srcDir = path.join(PKG_ROOT, 'template/base');

  if (!no_install) {
    logger.info(`\nUsing: ${chalk.cyan.bold(pkg_manager)}\n`);
  } else {
    logger.info('');
  }

  const spinner = ora(`Scaffolding in: ${project_dir}...\n`).start();

  if (fs.existsSync(project_dir)) {
    if (fs.readdirSync(project_dir).length === 0) {
      if (project_name !== '.')
        spinner.info(
          `${chalk.cyan.bold(
            project_name,
          )} exists but is empty, continuing...\n`,
        );
    } else {
      spinner.stopAndPersist();
      const { overwriteDir } = await inquirer.prompt<{
        overwriteDir: 'abort' | 'clear' | 'overwrite';
      }>({
        name: 'overwriteDir',
        type: 'list',
        message: `${chalk.redBright.bold('Warning:')} ${chalk.cyan.bold(
          project_name,
        )} already exists and isn't empty. How would you like to proceed?`,
        choices: [
          {
            name: 'Abort installation (recommended)',
            value: 'abort',
            short: 'Abort',
          },
          {
            name: 'Clear the directory and continue installation',
            value: 'clear',
            short: 'Clear',
          },
          {
            name: 'Continue installation and overwrite conflicting files',
            value: 'overwrite',
            short: 'Overwrite',
          },
        ],
        default: 'abort',
      });
      if (overwriteDir === 'abort') {
        spinner.fail('Aborting installation...');
        process.exit(1);
      }

      const overwriteAction =
        overwriteDir === 'clear'
          ? 'clear the directory'
          : 'overwrite conflicting files';

      const { confirmOverwriteDir } = await inquirer.prompt<{
        confirmOverwriteDir: boolean;
      }>({
        name: 'confirmOverwriteDir',
        type: 'confirm',
        message: `Are you sure you want to ${overwriteAction}?`,
        default: false,
      });

      if (!confirmOverwriteDir) {
        spinner.fail('Aborting installation...');
        process.exit(1);
      }

      if (overwriteDir === 'clear') {
        spinner.info(
          `Emptying ${chalk.cyan.bold(
            project_name,
          )} and creating drippy api..\n`,
        );
        fs.emptyDirSync(project_dir);
      }
    }
  }

  spinner.start();

  fs.copySync(srcDir, project_dir);
  fs.renameSync(
    path.join(project_dir, '_gitignore'),
    path.join(project_dir, '.gitignore'),
  );

  const scaffoldedName =
    project_name === '.' ? 'Api' : chalk.cyan.bold(project_name);

  spinner.succeed(
    `${scaffoldedName} ${chalk.green('scaffolded successfully!')}\n`,
  );
};
