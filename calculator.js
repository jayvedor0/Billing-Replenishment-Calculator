export function calculateReplenishment({
  currentTrust = 0,
  requiredTrust = 0,
  workInProgress = 0,
  outstanding = 0,
  includeWip = false,
  includeOutstanding = false,
  additionalRequirement = 0,
}) {
  const current = Math.max(0, Number(currentTrust) || 0);
  const required = Math.max(0, Number(requiredTrust) || 0);
  const wip = Math.max(0, Number(workInProgress) || 0);
  const owed = Math.max(0, Number(outstanding) || 0);
  const additional = Math.max(0, Number(additionalRequirement) || 0);
  const trustShortfall = Math.max(required - current, 0);
  const includedWip = includeWip ? wip : 0;
  const includedOutstanding = includeOutstanding ? owed : 0;
  const recommended = trustShortfall + includedWip + includedOutstanding + additional;
  return { current, required, wip, outstanding: owed, additional, trustShortfall, includedWip, includedOutstanding, recommended };
}

export function formatUsd(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value) || 0);
}

export function buildClientMessage({ event = 'No upcoming event', tone = 'Professional', result }) {
  const { current, required, trustShortfall, includedWip, includedOutstanding, additional, recommended } = result;
  const amount = formatUsd(recommended);
  const currentText = formatUsd(current);
  const eventText = event === 'No upcoming event' ? '' : ` due to your upcoming ${event.toLowerCase()}`;

  let body;
  if (tone === 'Friendly') {
    body = `Hi, just wanted to provide an update on your trust account. Your current trust balance is ${currentText}.${eventText ? ` With your ${event.toLowerCase()} coming up,` : ''} we are requesting ${amount} to cover the required amount and any selected remaining work.`;
  } else if (tone === 'Direct') {
    body = `Your current trust balance is ${currentText}. We are requesting ${amount}${eventText} to cover the required trust amount and selected remaining work.`;
  } else if (tone === 'Urgent') {
    body = `Your current trust balance is ${currentText}. To avoid delays${eventText ? ` with your ${event.toLowerCase()}` : ''}, we are requesting ${amount} to cover the required trust amount and selected remaining work.`;
  } else {
    if (event !== 'No upcoming event' && required > 0) {
      body = `Due to your upcoming ${event.toLowerCase()}, our office requires your trust account to be replenished to ${formatUsd(required)}. Your current trust balance is ${currentText}, leaving a balance of ${formatUsd(trustShortfall)} needed to meet the required amount.`;
    } else {
      body = `Your current trust balance is ${currentText}. We are requesting ${amount} to replenish the account and cover the selected remaining work.`;
    }
  }

  const additions = [];
  if (includedWip > 0) additions.push(`Work in progress: ${formatUsd(includedWip)}`);
  if (includedOutstanding > 0) additions.push(`Outstanding balance: ${formatUsd(includedOutstanding)}`);
  if (additional > 0) additions.push(`Additional legal team requirement: ${formatUsd(additional)}`);
  return additions.length ? `${body} ${additions.join('; ')}.` : body;
}
