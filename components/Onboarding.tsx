
import React, { useState } from 'react';
import { EmergencyContact } from '../types';

interface OnboardingProps {
  onComplete: (name: string, userPhone: string, contacts: EmergencyContact[]) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [contacts, setContacts] = useState<string[]>(['', '', '', '', '']);
  const [contactNames, setContactNames] = useState<string[]>(['', '', '', '', '']);
  const [error, setError] = useState('');

  const validateIndianNumber = (num: string) => {
    const cleaned = num.replace(/\D/g, '');
    // Matches 10 digits or 12 digits (with 91)
    const regex = /^(91)?[6-9]\d{9}$/;
    return regex.test(cleaned);
  };

  const handleNext = () => {
    if (step === 1) {
      if (!userName.trim()) {
        setError('Please enter your name');
        return;
      }
      if (!validateIndianNumber(userPhone)) {
        setError('Please enter a valid 10-digit Indian phone number');
        return;
      }
      setError('');
      setStep(2);
    } else {
      const validContacts = contacts
        .map((num, i) => ({ phone: num.trim(), name: contactNames[i].trim() }))
        .filter(c => c.phone.length > 0 && c.name.length > 0);

      if (validContacts.length < 2) {
        setError('Please add at least 2 emergency contacts');
        return;
      }

      for (const contact of validContacts) {
        if (!validateIndianNumber(contact.phone)) {
          setError(`"${contact.name}" has an invalid Indian phone number`);
          return;
        }
      }

      const formattedContacts: EmergencyContact[] = validContacts.map((c, i) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: c.name,
        phone: c.phone.replace(/\D/g, '').slice(-10)
      }));

      onComplete(userName, userPhone.replace(/\D/g, '').slice(-10), formattedContacts);
    }
  };

  return (
    <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col min-h-screen bg-white">
      <header className="mb-8 mt-12 text-center">
        <div className="w-20 h-20 bg-rose-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-rose-200 rotate-3">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-1 tracking-tight uppercase">SHE RAKSHA</h1>
        <p className="text-gray-500 text-sm font-medium">India's Personalized Safety Shield</p>
      </header>

      <div className="flex-1">
        {step === 1 ? (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-gray-900">Personal Details</h2>
              <p className="text-sm text-gray-500">How should we identify you in alerts?</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Full Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-4 rounded-2xl bg-gray-50 border-2 border-gray-100 text-gray-900 font-semibold focus:border-rose-500 focus:bg-white outline-none transition-all placeholder:text-gray-300"
                  placeholder="e.g., Sarah Sharma"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Your Mobile (+91)</label>
                <input
                  type="tel"
                  className="w-full px-4 py-4 rounded-2xl bg-gray-50 border-2 border-gray-100 text-gray-900 font-semibold focus:border-rose-500 focus:bg-white outline-none transition-all placeholder:text-gray-300"
                  placeholder="98765 43210"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900">SOS Circle</h2>
              <p className="text-sm text-gray-500">Contacts will receive auto-alerts with your GPS.</p>
            </div>
            <div className="space-y-4 max-h-[45vh] overflow-y-auto pr-2 custom-scrollbar">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-2xl border-2 border-gray-100 space-y-3">
                  <input
                    type="text"
                    placeholder={`Name (e.g., Father)`}
                    className="w-full bg-white px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 font-medium focus:ring-2 focus:ring-rose-400 outline-none"
                    value={contactNames[i]}
                    onChange={(e) => {
                      const newNames = [...contactNames];
                      newNames[i] = e.target.value;
                      setContactNames(newNames);
                    }}
                  />
                  <input
                    type="tel"
                    placeholder={`10-digit Mobile`}
                    className="w-full bg-white px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 font-medium focus:ring-2 focus:ring-rose-400 outline-none"
                    value={contacts[i]}
                    onChange={(e) => {
                      const newContacts = [...contacts];
                      newContacts[i] = e.target.value;
                      setContacts(newContacts);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-auto">
        {error && (
          <div className="bg-rose-50 border border-rose-100 p-3 rounded-xl mb-4 animate-bounce">
            <p className="text-rose-600 text-xs font-bold text-center">{error}</p>
          </div>
        )}
        <button
          onClick={handleNext}
          className="w-full bg-gray-900 text-white font-black py-5 rounded-2xl shadow-2xl hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          {step === 1 ? 'Configure Safety Circle' : 'Activate She Raksha Shield'}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Onboarding;