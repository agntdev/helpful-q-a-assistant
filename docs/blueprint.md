# Helpful Q&A Assistant — Bot specification

**Archetype:** content

**Voice:** helpful and professional — write every user-facing message, button label, error, and empty state in this voice.

A Telegram bot that answers user questions conversationally in a helpful, professional tone. It maintains context for follow-ups, offers brevity preferences, and collects feedback with admin notifications for reports/errors.

> This is the complete contract for the bot. Implement EVERY entry point, flow, feature, integration, and edge case below. The completeness review checks the bot against this document after each build pass.

## Primary audience

- General public Telegram users seeking factual/how-to answers
- Non-technical users expecting polite assistance

## Success criteria

- Users receive accurate answers with 90% feedback rating as 'Useful'
- 70% of users engage in 3+ follow-up messages per session

## Entry points

Every feature must be reachable from the bot's command/button surface (button-first; only /start and /help are slash commands).

- **/start** (command, actor: user, command: /start) — Show welcome message with usage hints and privacy notice
- **/help** (command, actor: user, command: /help) — Display available commands and example prompts
- **/settings** (command, actor: user, command: /settings) — Adjust answer brevity preference (Short/Detailed)
- **Useful** (button, actor: user, callback: feedback:useful) — Mark answer as helpful
- **Not Useful** (button, actor: user, callback: feedback:not_useful) — Mark answer as unhelpful
- **Report** (button, actor: user, callback: feedback:report) — Flag answer for admin review

## Flows

### Onboarding
_Trigger:_ /start

1. Show welcome message with usage examples
2. Display privacy notice

_Data touched:_ User

### Question Answering
_Trigger:_ User sends message

1. Analyze question content
2. Generate concise professional answer
3. Show follow-up invitation with feedback buttons

_Data touched:_ Conversation, Message

### Follow-up Context
_Trigger:_ User sends follow-up message

1. Retrieve recent conversation history
2. Generate context-aware response

_Data touched:_ Conversation

### Feedback Handling
_Trigger:_ User selects feedback button

1. Log feedback type
2. Send report details to admin (if flagged)

_Data touched:_ Feedback

## Data entities

Durable data (must survive a restart) uses the toolkit's persistent store, never in-memory maps.

- **User** _(retention: persistent)_ — Telegram account with preferences and conversation history
  - fields: telegram_id, brevity_preference, last_active
- **Conversation** _(retention: session)_ — Context window of last 10 messages for follow-up continuity
  - fields: message_history, context_expiration
- **Feedback** _(retention: persistent)_ — User ratings and reports for answers
  - fields: rating, original_message, user_id

## Integrations

- **Telegram** (required) — Bot API messaging and inline buttons
Call external APIs against their real contract (correct endpoints, ids, params); credentials from env. Do not fake responses.

## Owner controls

- Admin group for receiving reports/feedback
- Brevity preference defaults
- Context retention duration (7 days)

## Notifications

- Admin alerts for feedback:report selections
- Error logs for recurring message failures

## Permissions & privacy

- Anonymize feedback logs
- Expire conversation context after 7 days
- No storage of sensitive domains (legal/medical/financial)

## Edge cases

- Handling flagged content in feedback:report
- Error recovery for message generation failures
- Context expiration during active sessions

## Required tests

- End-to-end test of question-answer-followup flow
- Feedback reporting to admin verification
- Context retention expiration validation

## Assumptions

- Admin group details will be configured separately
- Brevity levels (Short/Detailed) will use predefined templates
- Context window size (10 messages) is sufficient for typical conversations
