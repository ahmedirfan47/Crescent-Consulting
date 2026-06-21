// Shared "wants a human" intent detection — used client-side as an
// immediate fast-path trigger for the lead capture form, and server-side
// as a secondary signal for flagging conversations in the admin dashboard.

export const ESCALATION_KEYWORDS = [
  'human',
  'agent',
  'representative',
  'real person',
  'talk to someone',
  'speak to someone',
  'speak with someone',
  'talk to a person',
]

export function containsEscalationIntent(text: string): boolean {
  const lower = text.toLowerCase()
  return ESCALATION_KEYWORDS.some((k) => lower.includes(k))
}