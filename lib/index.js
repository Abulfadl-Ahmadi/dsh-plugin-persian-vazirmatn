// dsh-plugin-persian-vazirmatn: Host side entry
export const name = 'persianVazirmatn';

export function apply(ctx) {
  if (ctx.logger) {
    ctx.logger('persian-vazirmatn').info('Persian Vazirmatn font & LaTeX protection plugin initialized');
  }
}
