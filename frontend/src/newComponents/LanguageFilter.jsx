// LanguageFilter.jsx
import React from 'react';

const LanguageFilter = ({ languages, selectedLanguage, setSelectedLanguage }) => {
  return (
    <div className="mb-4">
      <label className="block mb-2">Select Language</label>
      <select
        value={selectedLanguage}
        onChange={(e) => setSelectedLanguage(e.target.value)}
        className="w-full p-2 border"
      >
        <option value="">All Languages</option>
        {languages.map((lang) => (
          <option key={lang} value={lang}>{lang}</option>
        ))}
      </select>
    </div>
  );
};

export default LanguageFilter;
