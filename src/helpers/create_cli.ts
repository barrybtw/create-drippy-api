import { Command } from 'commander';
import inquirer from 'inquirer';
import { CREATE_USER_APP, DEFAULT_APP_NAME } from '@/consts.js';
import { validateAppName } from '@/lib/validate_appname.js';
import { get_version } from '@/lib/get_version.js';
import { available_http_clients } from '@/installers/index.js';

interface CliFlags {
  no_git: boolean;
  no_install: boolean;
}

interface CliResults {
  app_name: string;
  http_client: available_http_clients;
  flags: CliFlags;
}

export const defaultOptions: CliResults = {
  app_name: DEFAULT_APP_NAME,
  http_client: 'express',
  flags: {
    no_git: false,
    no_install: false,
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
    cliResults.app_name = cliProvidedName;
  }

  cliResults.flags = program.opts();
  if (!cliProvidedName) {
    cliResults.app_name = await prompt_app_name();
  }
  cliResults.http_client = await prompt_http_client();
  if (!cliResults.flags.no_git) {
    cliResults.flags.no_git = !(await prompt_git());
  }
  if (!cliResults.flags.no_install) {
    cliResults.flags.no_install = !(await prompt_install());
  }

  return cliResults;
};

const prompt_app_name = async (): Promise<string> => {
  const { app_name } = await inquirer.prompt<Pick<CliResults, 'app_name'>>({
    name: 'app_name',
    type: 'input',
    message: 'What will your awesome api be called?',
    default: defaultOptions.app_name,
    validate: validateAppName,
    transformer: (input: string) => {
      return input.trim();
    },
  });

  return app_name;
};

const prompt_http_client = async (): Promise<available_http_clients> => {
  const { http_client } = await inquirer.prompt<
    Pick<CliResults, 'http_client'>
  >({
    name: 'http_client',
    type: 'list',
    message: 'What http client would you like to use?',
    choices: available_http_clients,
    default: defaultOptions.http_client,
  });

  return http_client;
};

const prompt_git = async (): Promise<boolean> => {
  const { git } = await inquirer.prompt<{ git: boolean }>({
    name: 'git',
    type: 'confirm',
    message: 'Would you like to initialize a git repo for this project?',
    default: true,
  });

  return git;
};

const prompt_install = async (): Promise<boolean> => {
  const { install } = await inquirer.prompt<{ install: boolean }>({
    name: 'install',
    type: 'confirm',
    message: 'Would you like to install dependencies now?',
    default: true,
  });

  return install;
};
