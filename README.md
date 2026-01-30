# Kids Companion for Lunch Money

A simple PWA that shows kids their money without exposing your full [Lunch Money](https://lunchmoney.app) account.

![Demo](usage.gif)

## What it does

Shows 3 accounts from your Lunch Money as "buckets":

- **Long-term Savings** - money they can't touch
- **Goal Savings** - saving for something specific, with progress bar
- **Free Spending** - their spending money + recent transactions

That's it. Read-only, no write access to your data.

## Setup

1. Create 3 accounts in Lunch Money for your kid (can be [manually-managed](https://support.lunchmoney.app/setup/accounts), no bank link needed)
2. Open the app, tap the money bag 5 times to get to parent settings
3. Paste your [API token](https://my.lunchmoney.app/developers), pick the 3 accounts
4. Done

**Hosted version:** [lunch-money-kids.netlify.app](https://lunch-money-kids.netlify.app)

**Self-host:**
```bash
git clone https://github.com/H1D/lunch-money-kids-companion.git
cd lunch-money-kids-companion/vibecoding_output
pnpm install && pnpm build
# deploy dist/ wherever
```

## Other stuff

- Works offline (PWA)
- Themes
- i18n: EN, ES, NL, FR, IT, DE, PT
- API token stored in browser only, never hits a server

## License

MIT
