import { Country } from "country-state-city";
import SelectField from "./SelectField";

interface CountryComponentProps {
  control: any;
  error: any;
  name: string;
  title: string;
  placeholder: string;
  handleChange: (val: string | number | null) => void;
}

const CountryComponent = (props: CountryComponentProps) => {
  const { control, error, name, title, placeholder, handleChange } = props;

  const countries = Country.getAllCountries().map((country: { name: any }) => ({
    value: country.name,
    label: country.name,
  }));

  return (
    <SelectField
      control={control}
      error={error}
      name={name}
      title={title}
      placeholder={placeholder}
      className="customSelectForm"
      options={countries}
      emitChange={handleChange}
    />
  );
};

export default CountryComponent;
