import { logger } from '@/lib/logger.js';
import { render_title } from './lib/render-title.js';
import { run_cli } from './lib/cli.js';

const main = async () => {
  void render_title();
  const cli_results = await run_cli();
  logger.info(cli_results.app_name, cli_results.http_client, cli_results.orm);
};

main().catch((error) => {
  logger.error(error);
  process.exit(1);
});
