import React, { useState, useEffect, useRef } from 'react';
import { customerApi } from '../api/client.js';
import { User, Phone, MapPin, CheckCircle2, ChevronRight, X } from 'lucide-react';

/**
 * Customer Name Autocomplete Input
 * As the dealer types a customer name, fetches matching customers and auto-fills
 * their phone, address, and profile details upon selection.
 */
export const CustomerAutocompleteInput = ({
  value = '',
  onChange = () => {},
  onSelectCustomer = () => {},
  placeholder = 'Type customer name to search or enter new...',
  className = ''
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const wrapperRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions with debounce as the user types
  useEffect(() => {
    if (!value || value.trim().length < 1) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    // If currently matching what was already selected, don't reopen dropdown
    if (selectedMatch && selectedMatch.name === value) {
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await customerApi.getCustomers({ search: value.trim() });
        if (res.success && Array.isArray(res.data)) {
          setSuggestions(res.data);
          setIsOpen(res.data.length > 0);
        }
      } catch (err) {
        console.warn('Customer lookup error:', err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [value, selectedMatch]);

  const handleSelect = (customer) => {
    setSelectedMatch(customer);
    setIsOpen(false);
    onChange(customer.name || '');
    onSelectCustomer(customer);
  };

  const handleClearSelection = () => {
    setSelectedMatch(null);
    onChange('');
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative flex items-center">
        <div className="pointer-events-none absolute left-3 flex items-center justify-center text-stone-400 z-10">
          <User className="w-4 h-4 shrink-0" />
        </div>

        <input
          type="text"
          value={value}
          onChange={(e) => {
            setSelectedMatch(null);
            onChange(e.target.value);
          }}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          placeholder={placeholder}
          style={{ paddingLeft: '2.5rem', paddingRight: selectedMatch ? '2rem' : '0.875rem' }}
          className={`w-full border border-reseller-border rounded-xl py-2.5 text-xs text-reseller-text bg-white placeholder-stone-400 focus:outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500/10 transition ${className}`}
        />

        {selectedMatch && (
          <button
            type="button"
            onClick={handleClearSelection}
            className="absolute right-2.5 p-1 text-stone-400 hover:text-stone-600 rounded"
            title="Clear selection"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Autocomplete Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 mt-1 bg-white border border-reseller-border rounded-xl shadow-float py-1.5 z-50 max-h-60 overflow-y-auto animate-fadeIn">
          <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-reseller-muted border-b border-stone-100 flex items-center justify-between">
            <span>Matching Customers</span>
            <span>Click to auto-fill details</span>
          </div>

          {suggestions.map((cust) => (
            <button
              key={cust._id}
              type="button"
              onClick={() => handleSelect(cust)}
              className="w-full text-left px-3.5 py-2 hover:bg-stone-50 flex items-center justify-between gap-3 border-b border-stone-50 last:border-0 transition"
            >
              <div>
                <div className="font-semibold text-xs text-forest-900 flex items-center gap-1.5">
                  <span>{cust.name || 'Unnamed Customer'}</span>
                  <span className="text-[10px] font-normal text-stone-500 font-mono">({cust.phone})</span>
                </div>

                {cust.defaultAddress?.city && (
                  <div className="text-[11px] text-reseller-muted flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                    <span className="truncate">
                      {cust.defaultAddress.city}, {cust.defaultAddress.state} {cust.defaultAddress.pin ? `(${cust.defaultAddress.pin})` : ''}
                    </span>
                  </div>
                )}
              </div>

              <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            </button>
          ))}
        </div>
      )}

      {/* Selection Notice Badge */}
      {selectedMatch && (
        <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-medium text-emerald-800 bg-emerald-50/80 border border-emerald-200/60 px-2.5 py-1 rounded-lg animate-fadeIn">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Customer details auto-filled from database</span>
        </div>
      )}
    </div>
  );
};
