interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <div className="w-full">
      <label className="block">
        <span className="field-label">Search leads</span>
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value.trim())}
          placeholder="Search by name or email"
          className="field-input search-input"
        />
      </label>
    </div>
  );
};

export default SearchBar;
