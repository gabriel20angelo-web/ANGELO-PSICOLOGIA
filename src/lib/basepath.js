// Prefixo para imagens e assets estáticos.
// Quando basePath muda no next.config.js, mude aqui também.
// Se for username.github.io (sem subpasta), deixe como string vazia ''.
export const BASE_PATH = '/ANGELO-PSICOLOGIA';

export function img(path) {
  return `${BASE_PATH}${path}`;
}
