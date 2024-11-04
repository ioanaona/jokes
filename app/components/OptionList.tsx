import React, { useState } from "react";

type OptionListProps = {
  onSelect: (option: string) => void;
};

const OptionList: React.FC<OptionListProps> = ({ onSelect }) => {
  const options = ["work", "people", "animals", "food", "television"];
  
  // State to manage the selected option
  const [selectedOption, setSelectedOption] = useState<string>("");

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedOption(value); // Update the local state
    onSelect(value); // Pass the selected option to the parent
  };

  return (
    <form className="max-w-sm mx-auto mt-4">
      <select
        id="options"
        value={selectedOption} // Set the value of the select
        onChange={handleChange}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      >
        <option value="" disabled>
          Choose an option
        </option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </form>
  );
};

export default OptionList;
