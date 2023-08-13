export const available_http_clients = ['express', 'fastify'] as const;
export type available_http_clients = (typeof available_http_clients)[number];
