# Base AGENT (Common Constitution)

## Architecture Contract (Core & Extensions)
- `Core`: domain types / invariants / use-cases / ports only. Core must not know concrete I/O.
- `Extensions` (`Adapters`): DB/HTTP/fs/time/env/analytics/OGP/i18n and other side effects.

### Dependency Direction
- Allowed: `extensions|adapters -> core`
- Prohibited: `core -> extensions|adapters`

### Prohibited in Core
- DB access, HTTP calls, file I/O
- environment variable read, current-time direct dependency
- framework coupling (Next/React/etc.)

## Change Policy (Core change is exception)
When changing Core, PR must include all of the following:
1. reason: changed contract/invariant
2. impact scope
3. contract test updates
4. regression execution evidence
5. `docs/arch/core-change.md` update

## Verification
- Run `./scripts/arch_guard.sh` for every change.
- If `arch_guard` fails, fix boundary violations before merge.
