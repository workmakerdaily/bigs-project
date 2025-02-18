interface Props {
    label: string;
    type: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    errorMessage?: string;
}

const FormInput = ({ label, type, name, value, onChange, onBlur, errorMessage }: Props) => {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                className="mt-1 block w-full px-3 py-2 border-b border-gray-300 focus:outline-none focus:ring-[#2D6CDF] focus:border-[#2D6CDF] sm:text-sm"
            />
            {errorMessage && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}
        </div>
    );
};

export default FormInput;
