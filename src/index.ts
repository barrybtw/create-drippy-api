import '@total-typescript/ts-reset';

import { logger } from '@/lib/logger.js';
import { render_title } from './lib/render-title.js';
import { run_cli } from './helpers/create_cli.js';
import fs from 'fs-extra';
import { parseNameAndPath } from './lib/parse_name_and_path.js';
import { create_project } from './helpers/create_project.js';
import path from 'path';
import { PackageJson } from 'type-fest';
import { get_version } from './lib/get_version.js';
import { install_deps } from './helpers/install_deps.js';
import { initializeGit } from './helpers/git.js';
import { logNextSteps } from './helpers/next_steps.js';

type CDAPackageJson = PackageJson & {
  cdaMetadata?: {
    initVersion: string;
  };
};

const main = async () => {
  void render_title();
  const {
    app_name,
    http_client,
    flags: { no_git, no_install },
  } = await run_cli();

  // e.g. dir/@mono/app returns ["@mono/app", "dir/app"]
  const [scopedAppName, appDir] = parseNameAndPath(app_name);

  if (!scopedAppName) {
    throw new Error('No app name provided');
  }

  const project_dir = await create_project({
    http_client,
    no_git,
    no_install,
    project_name: scopedAppName,
  });

  logger.info(`\nCreated project at ${project_dir}\n`);

  // Write name to package.json
  const pkgJson = fs.readJSONSync(
    path.join(project_dir, 'package.json'),
  ) as CDAPackageJson;
  pkgJson.name = scopedAppName;
  pkgJson.cdaMetadata = { initVersion: get_version() };
  fs.writeJSONSync(path.join(project_dir, 'package.json'), pkgJson, {
    spaces: 2,
  });

  if (!no_install) {
    await install_deps({ project_dir });
  }

  if (!no_git) {
    await initializeGit(project_dir);
  }

  await logNextSteps({
    projectDir: project_dir,
    projectName: appDir,
    noInstall: no_install,
  });

  process.exit(0);
};

main().catch((error) => {
  logger.error(error);
  process.exit(1);
});
