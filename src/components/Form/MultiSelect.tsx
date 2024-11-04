import CreatableSelect from "react-select/creatable";

export const MultiSelect = ({
  value,
  onChange,
  options,
}: {
  value: any;
  onChange: any;
  options: { label: string; value: string }[];
}) => {
  return (
    <CreatableSelect
      isMulti
      defaultValue={value}
      onChange={(newVal) => {
        const values = newVal.map((i) => i.value);
        onChange(values);
      }}
      options={options}
    />
  );
};
