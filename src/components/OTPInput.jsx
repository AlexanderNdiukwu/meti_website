import { useRef } from 'react';

export default function OTPInput({ value, onChange, disabled = false }) {
  const refs = useRef([]);

  const handleChange = (index, val) => {
    if (val && !/^\d$/.test(val)) return;
    const updated = [...value];
    updated[index] = val;
    onChange(updated);
    if (val && index < 5) refs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasted)) {
      onChange(pasted.split(''));
      refs.current[5]?.focus();
    }
  };

  return (
    <div className="flex gap-2 justify-center">
      {value.map((digit, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className="w-11 h-12 text-center text-lg font-bold border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:opacity-50"
        />
      ))}
    </div>
  );
}
