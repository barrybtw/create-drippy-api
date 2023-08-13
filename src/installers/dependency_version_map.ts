/*
 * This maps the necessary packages to a version.
 * This improves performance significantly over fetching it from the npm registry.
 */
export const dependencyVersionMap = {
  // express
  express: '^4.18.2',
  '@types/express': '^4.17.17',

  // fastify : todo

  // nestjs : todo

  // honojs : todo
} as const;
export type AvailableDependencies = keyof typeof dependencyVersionMap;
