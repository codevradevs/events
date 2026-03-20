import React, { useState } from 'react';
import axios from 'axios';

export default function OrganizerOnboard() {
  const [step, setStep] = useState(1);
  const [kra, setKra] = useState('');
  
  const submitKra = async () => {
    await axios.post('http://localhost:5000/api/organizer/verify-kra', { kraPin: kra });
    setStep(2);
  };
  
  return (
    <div>
      {step === 1 && (
        <div>
          <h3>Step 1 — KRA verification</h3>
          <input value={kra} onChange={e => setKra(e.target.value)} placeholder="KRA PIN" />
          <button onClick={submitKra}>Verify KRA</button>
        </div>
      )}
      {step === 2 && <div>Step 2 — Phone verify (send OTP)</div>}
      {step === 3 && <div>Step 3 — Add payout details</div>}
    </div>
  );
}
