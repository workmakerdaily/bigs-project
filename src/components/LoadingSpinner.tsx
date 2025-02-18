// component: 로딩 스피너 //
const LoadingSpinner = () => {

    // render: 로딩 스피너 렌더링 //
    return (
        <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-75">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
};

export default LoadingSpinner;
