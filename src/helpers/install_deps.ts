import chalk from 'chalk';
import { execa } from 'execa';
import ora, { type Ora } from 'ora';

import {
  get_user_pkg_manager,
  type PackageManager,
} from '@/lib/get_user_pkg_manager.js';
import { logger } from '@/lib/logger.js';

interface Options {
  project_dir: string;
}

/*eslint-disable @typescript-eslint/no-floating-promises*/
const run_install_command = async (
  pkgManager: PackageManager,
  project_dir: string,
): Promise<Ora | null> => {
  switch (pkgManager) {
    // When using npm, inherit the stderr stream so that the progress bar is shown
    case 'npm':
      await execa(pkgManager, ['install'], {
        cwd: project_dir,
        stderr: 'inherit',
      });

      return null;
    // When using yarn or pnpm, use the stdout stream and ora spinner to show the progress
    case 'pnpm':
      const pnpmSpinner = ora('Running pnpm install...').start();
      const pnpmSubprocess = execa(pkgManager, ['install'], {
        cwd: project_dir,
        stdout: 'pipe',
      });

      await new Promise<void>((res, rej) => {
        pnpmSubprocess.stdout?.on('data', (data: Buffer) => {
          const text = data.toString();

          if (text.includes('Progress')) {
            pnpmSpinner.text = text.includes('|')
              ? text.split(' | ')[1] ?? ''
              : text;
          }
        });
        pnpmSubprocess.on('error', (e) => rej(e));
        pnpmSubprocess.on('close', () => res());
      });

      return pnpmSpinner;
    case 'yarn':
      const yarnSpinner = ora('Running yarn...').start();
      const yarnSubprocess = execa(pkgManager, [], {
        cwd: project_dir,
        stdout: 'pipe',
      });

      await new Promise<void>((res, rej) => {
        yarnSubprocess.stdout?.on('data', (data: Buffer) => {
          yarnSpinner.text = data.toString();
        });
        yarnSubprocess.on('error', (e) => rej(e));
        yarnSubprocess.on('close', () => res());
      });

      return yarnSpinner;
  }
};
/*eslint-enable @typescript-eslint/no-floating-promises*/

export const install_deps = async ({ project_dir }: Options) => {
  logger.info('Installing dependencies...');
  const pkgManager = get_user_pkg_manager();

  const installSpinner = await run_install_command(pkgManager, project_dir);

  // If the spinner was used to show the progress, use succeed method on it
  // If not, use the succeed on a new spinner
  (installSpinner ?? ora()).succeed(
    chalk.green('Successfully installed dependencies!\n'),
  );
};
