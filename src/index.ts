import '@total-typescript/ts-reset';

import { logger } from '@/lib/logger.js';
import { render_title } from './lib/render-title.js';
import { run_cli } from './helpers/create_cli.js';
import { parseNameAndPath } from './lib/parse_name_and_path.js';
import { create_project } from './helpers/create_project.js';

const main = async () => {
  void render_title();
  const {
    app_name,
    http_client,
    orm,
    flags: { no_git, no_install },
  } = await run_cli();
  logger.info('app_name:', app_name, 'http_client:', http_client, 'orm:', orm);
  logger.info('flags:', 'no_git:', no_git, 'no_install:', no_install);

  // e.g. dir/@mono/app returns ["@mono/app", "dir/app"]
  const [scopedAppName, _appDir] = parseNameAndPath(app_name);

  if (!scopedAppName) {
    throw new Error('No app name provided');
  }

  const project_dir = await create_project({
    http_client,
    no_git,
    no_install,
    orm,
    project_name: scopedAppName,
  });

  logger.info('project_dir:', project_dir);
};

main().catch((error) => {
  logger.error(error);
  process.exit(1);
});
