import markdownit, { PluginSimple } from "markdown-it";

/* CONSTANTS */
const BLOCK_RULER_DISABLED = [ 'code' ];

export default function rules({
  rules = {},
  plugins = [],
}: {
  rules?: Record<string, any>;
  plugins?: PluginSimple[];
}) {
  const markdownIt = markdownit("default", {
    breaks: false,
    html: false,
    linkify: false,
    ...rules,
  });

  plugins.forEach((plugin) => markdownIt.use(plugin));

  markdownIt.block.ruler.disable( BLOCK_RULER_DISABLED );

  return markdownIt;
}
