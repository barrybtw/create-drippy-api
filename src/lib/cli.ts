import chalk from 'chalk';
import { Command } from 'commander';
import inquirer from 'inquirer';
import { CREATE_USER_APP, DEFAULT_APP_NAME } from '@/lib/consts.js';
import { validateAppName } from './validate_appname.js';
import { get_version } from './get_version.js';
import { logger } from './logger.js';

const availableHttpClients = ['express', 'fastify'] as const;
type AvailableHttpClients = (typeof availableHttpClients)[number];

const availableORMs = ['prisma', 'drizzle', 'none'] as const;
type AvailableORMs = (typeof availableORMs)[number];

interface CliFlags {
  noGit: boolean;
  noInstall: boolean;
  importAlias: string;
}

interface CliResults {
  appName: string;
  httpClient: AvailableHttpClients;
  orm: AvailableORMs;
  flags: CliFlags;
}

export const defaultOptions: CliResults = {
  appName: DEFAULT_APP_NAME,
  httpClient: 'express',
  orm: 'none',
  flags: {
    noGit: false,
    noInstall: false,
    importAlias: '@/',
  },
} as const;

export const run_cli = async () => {
  const cliResults = defaultOptions;
  const program = new Command().name(CREATE_USER_APP);

  program
    .description('A CLI for creating web applications with the t3 stack')
    .argument(
      '[dir]',
      'The name of the application, as well as the name of the directory to create',
    )
    .option(
      '--noGit',
      'Explicitly tell the CLI to not initialize a new git repo in the project',
      false,
    )
    .option(
      '--noInstall',
      "Explicitly tell the CLI to not run the package manager's install command",
      false,
    )
    .version(get_version(), '-v, --version', 'Display the version number')
    .parse(process.argv);

  const cliProvidedName = program.args[0];
  if (cliProvidedName) {
    cliResults.appName = cliProvidedName;
  }

  cliResults.flags = program.opts();
  if (!cliProvidedName) {
    cliResults.appName = await promptAppName();
  }
  cliResults.httpClient = await promptHttpClient();
  cliResults.orm = await promptORM();
};

const promptAppName = async (): Promise<string> => {
  const { appName } = await inquirer.prompt<Pick<CliResults, 'appName'>>({
    name: 'appName',
    type: 'input',
    message: 'What will your awesome api be called?',
    default: defaultOptions.appName,
    validate: validateAppName,
    transformer: (input: string) => {
      return input.trim();
    },
  });

  return appName;
};

const promptHttpClient = async (): Promise<AvailableHttpClients> => {
  const { httpClient } = await inquirer.prompt<Pick<CliResults, 'httpClient'>>({
    name: 'httpClient',
    type: 'list',
    message: 'What http client would you like to use?',
    choices: availableHttpClients,
    default: defaultOptions.httpClient,
  });

  return httpClient;
};

const promptORM = async (): Promise<AvailableORMs> => {
  const { orm } = await inquirer.prompt<Pick<CliResults, 'orm'>>({
    name: 'orm',
    type: 'list',
    message: 'What ORM would you like to use?',
    choices: availableORMs,
    default: defaultOptions.orm,
  });

  return orm;
};
