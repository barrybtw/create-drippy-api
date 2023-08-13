import { get_user_pkg_manager } from '@/lib/get_user_pkg_manager.js';
import path from 'path';
import { scaffold_base } from './scaffold_base.js';
import { logger } from '@/lib/logger.js';
import { available_http_clients, available_orms } from '@/installers/index.js';
import { express_installer } from '@/installers/express.js';
import { fastify_installer } from '@/installers/fastify.js';

interface CreateProjectOptions {
  project_name: string;
  orm: available_orms;
  http_client: available_http_clients;
  no_install: boolean;
  no_git: boolean;
}

export const create_project = async ({
  no_git,
  no_install,
  project_name,
  http_client,
  orm,
}: CreateProjectOptions) => {
  const pkg_manager = get_user_pkg_manager();
  const project_dir = path.resolve(process.cwd(), project_name);

  await scaffold_base({
    project_name,
    project_dir,
    no_install,
    pkg_manager,
  });

  switch (http_client) {
    case 'express': {
      express_installer({ project_dir });
      logger.info(`\nInstalling express...\n`);
      break;
    }
    case 'fastify': {
      fastify_installer();
      logger.info(`\nInstalling fastify...\n`);
      break;
    }
    default: {
      logger.error(`\nHTTP Client not specified...\n`);
      break;
    }
  }

  switch (orm) {
    case 'prisma': {
      logger.info(`\nInstalling prisma...\n`);
      break;
    }
    case 'drizzle': {
      logger.info(`\nInstalling drizzle...\n`);
      break;
    }
    case 'none': {
      logger.info(`\nSkipping ORM...\n`);
      break;
    }
    default: {
      logger.error(`\nORM  not specified...\n`);
      break;
    }
  }

  if (!no_git) {
    logger.info(`\nInitializing git repo in: ${project_dir}\n`);
  }

  return project_dir;
};
