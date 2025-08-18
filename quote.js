// ==== Conn Simple — Quote Engine (quote.js) ====
// Works with quote.html. Calculates premium, generates policy shell,
// stores to localStorage, then redirects to policy.html for PDFs.

// ---- Config ----
const PLAN = {
  basic:   { label: 'Basic Liability', baseMonthly: 89 },
  standard:{ label: 'Standard',        baseMonthly: 129 },
  premium: { label: 'Premium',         baseMonthly: 169 }
};

// Light state factors (you can tune later)
const STATE_FACTORS = {
  NY:1.12, NJ:1.10, CA:1.08, FL:1.10, MA:1.06, CT:1.04, TX:1.05, PA:1.03
};

// Helpers
function genPolicyNumber(state){
  const d=new Date(), y=d.getFullYear(),
        mo=String(d.getMonth()+1).padStart(2,'0'),
        da=String(d.getDate()).padStart(2,'0'),
        rand=String(Math.floor(Math.random()*900000)+100000);
  return `CS-${(state||'CT')}-${y}${mo}${da}-${rand}`;
}
function addMonths(date, m){ const d=new Date(date); d.setMonth(d.getMonth()+m); return d; }
function toMMDDYYYY(d){ return `${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')}/${d.getFullYear()}`; }
function fmtUSD(n){ return '$' + n.toFixed(2); }

// Price calc
function computeMonthly(tier, state, vehicleStr){
  let monthly = PLAN[tier].baseMonthly;

  // add small vehicle-age adjustment
  const yrMatch = (vehicleStr||'').match(/(^|\s)(19|20)\d{2}/);
  if(yrMatch){
    const yr = Number(yrMatch[0]);
    const age = Math.max(0, (new Date().getFullYear() - yr));
    monthly += Math.min(30, Math.floor(age/5)*5); // +$5 per 5 yrs, cap +$30
  }

  // add state factor
  monthly *= (STATE_FACTORS[state] || 1);

  return Number(monthly.toFixed(2));
}

// Wire up form
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('quoteForm');
  if(!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Read values
    const name   = document.getElementById('name').value.trim();
    const addr   = document.getElementById('address').value.trim();
    const dob    = document.getElementById('dob').value;
    const state  = document.getElementById('state').value;
    const vehicle= document.getElementById('vehicle').value.trim();
    const tierEl = form.querySelector('input[name="tier"]:checked');
    const tier   = tierEl ? tierEl.value : '';

    // Basic validation
    const missing = [];
    if(!name) missing.push('Full Name');
    if(!addr) missing.push('Address');
    if(!dob) missing.push('Date of Birth');
    if(!state) missing.push('State');
    if(!vehicle) missing.push('Vehicle');
    if(!tier) missing.push('Coverage Tier');

    if(missing.length){
      alert('Please complete:\n- ' + missing.join('\n- '));
      return;
    }

    // Compute prices
    const monthly = computeMonthly(tier, state, vehicle);
    const defaultTerm = 6; // default to 6 months (user can switch to 12 on policy.html)
    const total = Number((monthly * defaultTerm).toFixed(2));

    // Create policy shell
    const policyNumber = genPolicyNumber(state);
    const eff = new Date();
    const exp = addMonths(eff, defaultTerm);

    // Save to localStorage for policy.html to auto-fill
    const payload = {
      step: 'quote',
      name,
      address: addr,
      state,
      dob,
      vehicle,
      tier,
      tierLabel: PLAN[tier].label,
      monthly,
      total,
      term: defaultTerm,
      policyNumber,
      eff: toMMDDYYYY(eff),
      exp: toMMDDYYYY(exp)
    };
    try{
      localStorage.setItem('cs_quote', JSON.stringify(payload));
    }catch(err){ /* ignore storage errors */ }

    // Go to policy page (where PDFs are generated)
    // If your policy page is at a different path, adjust the URL below.
    window.location.href = 'policy.html';
  });
});
