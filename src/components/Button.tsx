interface Props {
    text: string;
    onClick?: () => void;
    disabled?: boolean;
}

const Button = ({ text, onClick, disabled = false }: Props) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`w-full py-3 font-bold transition rounded-md text-white 
            ${disabled ? "bg-gray-400 cursor-not-allowed" : "bg-[#2D6CDF] hover:bg-[#1E4BB8]"}`}
        >
            {text}
        </button>
    );
};

export default Button;
