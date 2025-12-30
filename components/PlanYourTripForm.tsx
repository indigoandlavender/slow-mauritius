"use client";

import { useState } from "react";

// Shared Plan Your Trip Form Component
// Used across all Slow World properties
// site_id identifies which country/property (from env var SITE_ID)

interface Journey {
  slug: string;
  title: string;
}

interface PlanYourTripFormProps {
  journeys: Journey[];
  siteId: string; // e.g., "slow-morocco", "slow-namibia" - from SITE_ID env var
  apiEndpoint?: string;
  onSuccess?: () => void;
  darkMode?: boolean;
}

export default function PlanYourTripForm({
  journeys,
  siteId,
  apiEndpoint = "/api/plan-your-trip",
  onSuccess,
  darkMode = false,
}: PlanYourTripFormProps) {
  const [formData, setFormData] = useState({
    journey: "",
    month: "",
    year: "",
    travelers: "",
    days: "",
    language: "",
    budgetValue: 5000,
    requests: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    countryCode: "+1",
    country: "",
    hearAboutUs: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...formData,
          budget: formData.budgetValue, // Send as budget for backend
          site_id: siteId, // Secret identifier for backend
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("success");
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message);
    }
  };

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear + 1, currentYear + 2];

  const travelerOptions = ["1", "2", "3", "4", "5", "6", "7", "8+"];
  
  const languageOptions = [
    "English",
    "French",
    "Spanish",
    "German",
    "Italian",
    "Portuguese",
    "Arabic"
  ];

  const formatBudget = (value: number) => {
    return `€${value.toLocaleString()}`;
  };

  const hearAboutOptions = [
    "Google Search",
    "Instagram",
    "Facebook",
    "Friend or Family",
    "Travel Blog",
    "Other"
  ];

  const countries = [
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
    "Germany",
    "France",
    "Spain",
    "Italy",
    "Netherlands",
    "Belgium",
    "Switzerland",
    "Austria",
    "Sweden",
    "Norway",
    "Denmark",
    "Ireland",
    "New Zealand",
    "Singapore",
    "United Arab Emirates",
    "South Africa",
    "Brazil",
    "Mexico",
    "Japan",
    "South Korea",
    "India",
    "Morocco",
    "Other"
  ];

  const countryCodes = [
    "+1", "+44", "+61", "+33", "+49", "+34", "+39", 
    "+31", "+41", "+971", "+212", "+91", "+81"
  ];

  // Dark mode styles
  const inputStyle = darkMode 
    ? "w-full px-0 py-3 border-0 border-b border-white/20 bg-transparent focus:outline-none focus:border-white/60 transition-colors text-white placeholder:text-white/30"
    : "w-full px-0 py-3 border-0 border-b border-border bg-transparent focus:outline-none focus:border-foreground transition-colors";
  
  const selectStyle = darkMode
    ? "w-full px-0 py-3 border-0 border-b border-white/20 bg-transparent focus:outline-none focus:border-white/60 transition-colors appearance-none cursor-pointer text-white"
    : "w-full px-0 py-3 border-0 border-b border-border bg-transparent focus:outline-none focus:border-foreground transition-colors appearance-none cursor-pointer";

  const labelStyle = darkMode
    ? "block text-sm tracking-wide mb-2 text-white/80"
    : "block text-sm tracking-wide mb-2";

  const subLabelStyle = darkMode
    ? "block text-xs text-white/40 mb-1"
    : "block text-xs text-muted-foreground mb-1";

  const mutedStyle = darkMode
    ? "text-white/40"
    : "text-muted-foreground";

  // Dropdown arrow component
  const DropdownArrow = () => (
    <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
      <svg className={`w-5 h-5 ${darkMode ? 'text-white/40' : 'text-muted-foreground'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );

  const SmallDropdownArrow = () => (
    <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
      <svg className={`w-4 h-4 ${darkMode ? 'text-white/40' : 'text-muted-foreground'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );

  if (status === "success") {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <h2 className={`font-serif text-3xl md:text-4xl mb-6 ${darkMode ? 'text-white' : ''}`}>Thank You</h2>
        <p className={`text-lg mb-8 ${darkMode ? 'text-white/60' : 'text-muted-foreground'}`}>
          We've received your journey request and will be in touch within 24 hours, usually sooner.
        </p>
        <a 
          href="/" 
          className={`inline-block px-10 py-4 text-xs tracking-[0.2em] uppercase transition-colors ${
            darkMode 
              ? 'border border-white/20 text-white hover:bg-white hover:text-[#0a0a0a]'
              : 'bg-foreground text-background hover:bg-foreground/90'
          }`}
        >
          Back to Home
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* Journey Selection */}
      <div>
        <label className={labelStyle}>
          Which journey interests you?
        </label>
        <div className="relative">
          <select
            value={formData.journey}
            onChange={(e) => setFormData({ ...formData, journey: e.target.value })}
            className={selectStyle}
            required
          >
            <option value="">Select an option</option>
            {journeys.map((journey) => (
              <option key={journey.slug} value={journey.slug}>
                {journey.title}
              </option>
            ))}
            <option value="custom">Custom Journey</option>
          </select>
          <DropdownArrow />
        </div>
      </div>

      {/* Travel Dates */}
      <div>
        <label className={labelStyle}>
          When are you thinking of traveling?
        </label>
        <div className="grid grid-cols-2 gap-8">
          <div className="relative">
            <select
              value={formData.month}
              onChange={(e) => setFormData({ ...formData, month: e.target.value })}
              className={selectStyle}
              required
            >
              <option value="">Month</option>
              {months.map((month) => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
            <DropdownArrow />
          </div>
          <div className="relative">
            <select
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              className={selectStyle}
              required
            >
              <option value="">Year</option>
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <DropdownArrow />
          </div>
        </div>
      </div>

      {/* Number of Travelers */}
      <div>
        <label className={labelStyle}>
          How many travelers?
        </label>
        <div className="relative">
          <select
            value={formData.travelers}
            onChange={(e) => setFormData({ ...formData, travelers: e.target.value })}
            className={selectStyle}
            required
          >
            <option value="">Select</option>
            {travelerOptions.map((num) => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
          <DropdownArrow />
        </div>
      </div>

      {/* Trip Length */}
      <div>
        <label className={labelStyle}>
          How long would you like to travel?
        </label>
        <input
          type="text"
          value={formData.days}
          onChange={(e) => setFormData({ ...formData, days: e.target.value })}
          className={inputStyle}
          placeholder="e.g., 5-7 days"
        />
      </div>

      {/* Language */}
      <div>
        <label className={labelStyle}>
          Preferred guide language?
        </label>
        <div className="relative">
          <select
            value={formData.language}
            onChange={(e) => setFormData({ ...formData, language: e.target.value })}
            className={selectStyle}
          >
            <option value="">Select</option>
            {languageOptions.map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
          <DropdownArrow />
        </div>
      </div>

      {/* Budget Slider */}
      <div>
        <label className={`${labelStyle} mb-4`}>
          Approximate budget per person?
        </label>
        <div className="pt-2">
          <input
            type="range"
            min="1000"
            max="15000"
            step="500"
            value={formData.budgetValue}
            onChange={(e) => setFormData({ ...formData, budgetValue: parseInt(e.target.value) })}
            className={`w-full h-1 rounded-lg appearance-none cursor-pointer
              ${darkMode ? 'bg-white/20' : 'bg-border'}
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-4
              [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:shadow-md
              [&::-moz-range-thumb]:w-4
              [&::-moz-range-thumb]:h-4
              [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:cursor-pointer
              [&::-moz-range-thumb]:border-0
              ${darkMode 
                ? '[&::-webkit-slider-thumb]:bg-white [&::-moz-range-thumb]:bg-white' 
                : '[&::-webkit-slider-thumb]:bg-[#4a5043] [&::-moz-range-thumb]:bg-[#4a5043]'
              }`}
          />
          <div className={`flex justify-between mt-3 text-xs ${mutedStyle}`}>
            <span>€1,000</span>
            <span className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-foreground'}`}>
              {formatBudget(formData.budgetValue)}
            </span>
            <span>€15,000</span>
          </div>
        </div>
      </div>

      {/* Special Requests */}
      <div>
        <label className={labelStyle}>
          Special requests or interests
        </label>
        <textarea
          value={formData.requests}
          onChange={(e) => setFormData({ ...formData, requests: e.target.value })}
          rows={4}
          className={`${inputStyle} resize-none`}
          placeholder="Dietary restrictions, mobility needs, specific interests..."
        />
      </div>

      {/* Your Information Section */}
      <div className={`pt-8 border-t ${darkMode ? 'border-white/10' : 'border-border'}`}>
        <h3 className={`text-sm tracking-wide mb-8 ${darkMode ? 'text-white/60' : ''}`}>Your Information</h3>

        <div className="space-y-8">
          {/* Name */}
          <div>
            <label className={labelStyle}>
              Name <span className={mutedStyle}>(required)</span>
            </label>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className={subLabelStyle}>First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className={inputStyle}
                  required
                />
              </div>
              <div>
                <label className={subLabelStyle}>Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className={inputStyle}
                  required
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className={labelStyle}>
              Email <span className={mutedStyle}>(required)</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={inputStyle}
              required
            />
          </div>

          {/* Country */}
          <div>
            <label className={labelStyle}>
              Country of residence
            </label>
            <div className="relative">
              <select
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className={selectStyle}
                required
              >
                <option value="">Select</option>
                {countries.map((country) => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
              <DropdownArrow />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className={labelStyle}>
              Phone / WhatsApp
            </label>
            <div className="flex gap-4">
              <div className="relative w-32">
                <select
                  value={formData.countryCode}
                  onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                  className={selectStyle}
                >
                  {countryCodes.map((code) => (
                    <option key={code} value={code}>{code}</option>
                  ))}
                </select>
                <SmallDropdownArrow />
              </div>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={`flex-1 ${inputStyle}`}
                required
              />
            </div>
          </div>

          {/* How did you hear */}
          <div>
            <label className={labelStyle}>
              How did you hear about us? <span className={mutedStyle}>(Optional)</span>
            </label>
            <div className="relative">
              <select
                value={formData.hearAboutUs}
                onChange={(e) => setFormData({ ...formData, hearAboutUs: e.target.value })}
                className={selectStyle}
              >
                <option value="">Select</option>
                {hearAboutOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <DropdownArrow />
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {status === "error" && (
        <div className={`px-4 py-3 ${darkMode ? 'bg-red-900/20 border border-red-500/50 text-red-400' : 'bg-destructive/10 border border-destructive text-destructive'}`}>
          {errorMessage}
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={status === "loading"}
          className={`w-full py-4 text-sm tracking-[0.15em] uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            darkMode
              ? 'border border-white/20 text-white hover:bg-white hover:text-[#0a0a0a]'
              : 'bg-[#c4a882] text-white hover:bg-[#b09670]'
          }`}
        >
          {status === "loading" ? "Sending..." : "Submit"}
        </button>
      </div>
    </form>
  );
}
