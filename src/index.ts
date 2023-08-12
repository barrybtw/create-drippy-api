import { logger } from '@/lib/logger.js';

const main = async () => {
  logger.info(
    'Hello world! I am create-drippy-api! I am awesome... It is true!',
  );
};

main().catch((error) => {
  logger.error(error);
  process.exit(1);
});
