// Must match GATE_SECRET in gate-display/index.html
const GATE_SECRET = 'ADIZRAK-2025';
const SLOT_MS = 30_000;
const VALID_WINDOW = 1; // accept ±1 slot (~90 sec tolerance for clock drift)

// Identical algorithm to the web app
function simpleHash(str: string): string {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}

function currentSlot(): number {
  return Math.floor(Date.now() / SLOT_MS);
}

function makePin(slot: number, gate: string): string {
  return simpleHash(GATE_SECRET + ':' + slot + ':' + gate);
}

export interface QRValidationResult {
  valid: boolean;
  gate: string;
}

export function validateGateQR(data: string): QRValidationResult {
  try {
    const payload = JSON.parse(data) as { g?: string; s?: number; p?: string };
    const { g: gate, s: slot, p: pin } = payload;

    if (!gate || typeof slot !== 'number' || !pin) {
      return { valid: false, gate: '' };
    }

    const now = currentSlot();
    for (let delta = -VALID_WINDOW; delta <= VALID_WINDOW; delta++) {
      if (makePin(now + delta, gate) === pin) {
        return { valid: true, gate };
      }
    }

    return { valid: false, gate };
  } catch {
    return { valid: false, gate: '' };
  }
}
