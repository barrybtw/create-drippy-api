export const available_http_clients = ['express', 'fastify'] as const;
export type available_http_clients = (typeof available_http_clients)[number];

export const available_orms = ['prisma', 'drizzle', 'none'] as const;
export type available_orms = (typeof available_orms)[number];
