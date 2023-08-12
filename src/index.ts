import { logger } from '@/lib/logger.js';
import { render_title } from './lib/render-title.js';
import { run_cli } from './lib/cli.js';

const main = async () => {
  void render_title();
  void run_cli();
};

main().catch((error) => {
  logger.error(error);
  process.exit(1);
});
