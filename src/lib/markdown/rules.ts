import markdownit, { PluginSimple } from "markdown-it";

/* CONSTANTS */
const BLOCK_RULER_DISABLED = [ 'code' ];

const FLASHCARD_BLOCK_RULER_DISABLED = [ 'code', 'list', 'heading', 'lheading', 'table', 'fence', 'blockquote', 'hr' ];
const FLASHCARD_CORE_RULER_DISABLED = [ 'tables-pm', 'embeds', 'checkboxes', 'linkify', 'emoji', 'smartquotes' ];
const FLASHCARD_INLINE_RULER_DISABLED = [ 'autolink', 'image', 'link' ];

export default function rules({
  rules = {},
  plugins = [],
  isFlashcardEditor = true,
}: {
  rules?: Record<string, any>;
  plugins?: PluginSimple[];
  isFlashcardEditor?: boolean;
}) {
  const markdownIt = markdownit("default", {
    breaks: false,
    html: false,
    linkify: false,
    ...rules,
  });

  plugins.forEach((plugin) => markdownIt.use(plugin));

  if ( isFlashcardEditor ) {
    markdownIt.block.ruler.disable( FLASHCARD_BLOCK_RULER_DISABLED );
    markdownIt.core.ruler.disable( FLASHCARD_CORE_RULER_DISABLED );
    markdownIt.inline.ruler.disable( FLASHCARD_INLINE_RULER_DISABLED );
  }
  else {
    markdownIt.block.ruler.disable( BLOCK_RULER_DISABLED );
  }

  return markdownIt;
}
