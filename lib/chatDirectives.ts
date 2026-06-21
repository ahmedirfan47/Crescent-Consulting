// Lightweight "directive" protocol the AI can emit at the end of a reply to
// trigger on-page UI behavior — lead capture or section suggestions —
// without ever redirecting the visitor off the website.
//
// The model is instructed (see knowledgeBase.ts) to append these as the
// final line(s) of its reply. This function strips them out before the
// text is shown to the visitor and returns structured flags instead.

const VALID_SECTIONS = ['services', 'industries', 'about', 'insights', 'contact'] as const
export type SuggestedSection = (typeof VALID_SECTIONS)[number]

const LEAD_FORM_PATTERN = /^\[\[LEAD_FORM\]\]$/
const SUGGEST_PATTERN = /^\[\[SUGGEST:([a-z,]+)\]\]$/

export interface ParsedDirectives {
  cleanText: string
  offerLeadForm: boolean
  suggestedSections: SuggestedSection[]
}

export function parseDirectives(rawReply: string): ParsedDirectives {
  const lines = rawReply.split('\n')
  let offerLeadForm = false
  let suggestedSections: SuggestedSection[] = []

  // Strip trailing directive lines. Loops defensively in case the model
  // emits more than the one line it's instructed to.
  while (lines.length > 0) {
    const last = lines[lines.length - 1].trim()

    if (LEAD_FORM_PATTERN.test(last)) {
      offerLeadForm = true
      lines.pop()
      continue
    }

    const suggestMatch = last.match(SUGGEST_PATTERN)
    if (suggestMatch) {
      const ids = suggestMatch[1]
        .split(',')
        .filter((id): id is SuggestedSection => (VALID_SECTIONS as readonly string[]).includes(id))
      suggestedSections = [...suggestedSections, ...ids]
      lines.pop()
      continue
    }

    if (last === '' && lines.length > 1) {
      lines.pop()
      continue
    }

    break
  }

  return {
    cleanText: lines.join('\n').trim(),
    offerLeadForm,
    suggestedSections: Array.from(new Set(suggestedSections)),
  }
}