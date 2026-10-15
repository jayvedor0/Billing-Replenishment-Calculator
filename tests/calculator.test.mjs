import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateReplenishment, formatUsd, buildClientMessage } from '../calculator.js';

test('calculates a mediation shortfall', () => {
  const result = calculateReplenishment({ currentTrust: 852.95, requiredTrust: 4000 });
  assert.equal(result.trustShortfall, 3147.05);
  assert.equal(result.recommended, 3147.05);
});

test('adds only explicitly included WIP and additional requirement', () => {
  const result = calculateReplenishment({ currentTrust: 852.95, requiredTrust: 4000, workInProgress: 79.50, includeWip: false, additionalRequirement: 1000 });
  assert.equal(result.recommended, 4147.05);
});

test('adds WIP when selected', () => {
  const result = calculateReplenishment({ currentTrust: 852.95, requiredTrust: 4000, workInProgress: 79.50, includeWip: true, additionalRequirement: 1000 });
  assert.equal(result.recommended, 4226.55);
});

test('adds outstanding only when selected', () => {
  const result = calculateReplenishment({ currentTrust: 500, requiredTrust: 1000, outstanding: 1405, includeOutstanding: false });
  assert.equal(result.recommended, 500);
  const included = calculateReplenishment({ currentTrust: 500, requiredTrust: 1000, outstanding: 1405, includeOutstanding: true });
  assert.equal(included.recommended, 1905);
});

test('never returns a negative trust shortfall', () => {
  const result = calculateReplenishment({ currentTrust: 5000, requiredTrust: 1000 });
  assert.equal(result.trustShortfall, 0);
  assert.equal(result.recommended, 0);
});

test('formats currency as USD', () => {
  assert.equal(formatUsd(1090.91), '$1,090.91');
});

test('generates a mediation client message', () => {
  const result = calculateReplenishment({ currentTrust: 852.95, requiredTrust: 4000, additionalRequirement: 1000 });
  const message = buildClientMessage({ event: 'Mediation', tone: 'Professional', result });
  assert.match(message, /upcoming mediation/);
  assert.match(message, /\$4,000\.00/);
  assert.match(message, /\$3,147\.05/);
  assert.match(message, /\$1,000\.00/);
});
