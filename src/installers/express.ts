import { PKG_ROOT } from '@/consts.js';
import { PackageManager } from '@/lib/get_user_pkg_manager.js';
import { logger } from '@/lib/logger.js';
import path from 'path';
import fs from 'fs-extra';
import { addPackageDependency } from '@/lib/add_dependency.js';

export const express_installer = ({
  project_dir,
  pkg_manager,
}: {
  project_dir: string;
  pkg_manager: PackageManager;
}) => {
  logger.info(project_dir, pkg_manager);
  const extrasDir = path.join(PKG_ROOT, 'template/extras');
  const epxressDir = path.join(extrasDir, 'express');

  addPackageDependency({
    dependencies: ['express'],
    devMode: false,
    projectDir: project_dir,
  });

  addPackageDependency({
    dependencies: ['@types/express'],
    devMode: true,
    projectDir: project_dir,
  });

  const indexSrc = path.join(epxressDir, 'src/index.mts');
  const indexDest = path.join(project_dir, 'src/index.mts');

  const envFileSrc = path.join(epxressDir, '_env');
  const envFileDest = path.join(project_dir, '.env');

  const routerFolderSrc = path.join(epxressDir, 'src/router');
  const routerFolderDest = path.join(project_dir, 'src/routes');

  fs.copySync(indexSrc, indexDest);
  fs.copySync(envFileSrc, envFileDest);
  fs.copySync(routerFolderSrc, routerFolderDest);
};
