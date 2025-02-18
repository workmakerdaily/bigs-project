// interface: 버튼 컴포넌트 Props //
interface Props {
    text: string;
    onClick?: () => void;
    disabled?: boolean;
}

// component: 공용 버튼 컴포넌트 //
const Button = ({ text, onClick, disabled = false }: Props) => {

    // render: 공용 버튼 컴포넌트 렌더링 //
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
