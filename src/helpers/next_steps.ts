import { DEFAULT_APP_NAME } from '@/consts.js';
import { isInsideGitRepo, isRootGitRepo } from './git.js';
import { logger } from '@/lib/logger.js';
import { get_user_pkg_manager } from '@/lib/get_user_pkg_manager.js';

// This logs the next steps that the user should take in order to advance the project
export const logNextSteps = async ({
  projectName = DEFAULT_APP_NAME,
  noInstall,
  projectDir,
}: {
  projectName: string;
  noInstall?: boolean;
  projectDir: string;
}) => {
  const pkgManager = get_user_pkg_manager();

  logger.info('Next steps:');
  projectName !== '.' && logger.info(`  cd ${projectName}`);
  if (noInstall) {
    // To reflect yarn's default behavior of installing packages when no additional args provided
    if (pkgManager === 'yarn') {
      logger.info(`  ${pkgManager}`);
    } else {
      logger.info(`  ${pkgManager} install`);
    }
  }

  logger.info(`  ${pkgManager === 'npm' ? 'npm run' : pkgManager} dev`);

  if (!(await isInsideGitRepo(projectDir)) && !isRootGitRepo(projectDir)) {
    logger.info(`  git init`);
  }
  logger.info(`  git commit -m "initial commit"`);
};
