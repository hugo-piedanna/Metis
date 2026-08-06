# Contributing to Metis

Thanks for your interest in Metis. The project is in an early stage and open source: small, focused contributions help more than large unsolicited rewrites.

## Before you start

1. Check [open issues](https://github.com/hugo-piedanna/Metis/issues) to see if someone is already working on the same topic.
2. For non-trivial changes, open an issue first (bug or feature template under `.github/ISSUE_TEMPLATE/`) so the approach can be discussed.
3. Read the [branching policy](BRANCHING_POLICY.md) and [API response conventions](API_RESPONSE_CONVENTIONS.md).

## Development setup

Follow the [Getting started](README.md#getting-started) section in the README:

```bash
cp .env.exemple .env
# fill in values
docker compose up --build
```

From `backend/`:

```bash
npm install
npm run lint
npm test
```

## Branch naming

Create a branch from `develop` (or from `main` if `develop` does not exist yet on your clone):

```text
type/xxx-short-description
```

Examples: `feat/12-add-expiry-date`, `fix/34-lot-quantity-validation`, `docs/56-readme-setup`.

Allowed `type` values are listed in [BRANCHING_POLICY.md](BRANCHING_POLICY.md).

## Making changes

- Keep PRs focused on one concern.
- Match existing code style (Prettier + ESLint in `backend/`).
- Prefer clear names and small functions over clever abstractions.
- API responses must follow [API_RESPONSE_CONVENTIONS.md](API_RESPONSE_CONVENTIONS.md).
- Add or update tests when you change behavior.
- Do not commit secrets or a real `.env` file.

## Pull requests

1. Open a PR against `develop` (or `main` if that is the only shared branch).
2. Describe **why** the change is needed and how to verify it.
3. Link related issues (`Fixes #123` when applicable).
4. Ensure lint and tests pass locally before requesting review.

Suggested PR checklist:

- [ ] Branch name follows the policy
- [ ] Lint / tests pass
- [ ] Docs updated if behavior or setup changed
- [ ] No unrelated refactors

## Reporting bugs

Use the bug report issue template and include:

- What you expected vs what happened
- Steps to reproduce
- Environment (OS, Docker / Node versions) when relevant

## Feature ideas

Use the feature issue template with a short description, acceptance criteria, and any technical notes. Metis is personal / experimental for now: ideas may be deferred or reshaped.

## Code of conduct (lightweight)

Be respectful and constructive. Assume good intent. Harassment or personal attacks are not acceptable.

## License

By contributing, you agree that your contributions are licensed under the [MIT License](LICENSE) that covers this project.
