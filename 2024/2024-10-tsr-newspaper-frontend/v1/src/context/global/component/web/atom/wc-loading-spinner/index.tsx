const LoadingSpinner: React.FC = () => {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <div className="relative">
          <div className="w-12 h-12 rounded-full absolute border-2 border-solid border-gray-200"></div>
          <div className="w-12 h-12 rounded-full animate-spin absolute border-2 border-solid border-secondary border-t-transparent shadow-md"></div>
        </div>
      </div>
    );
  };
  
  export default LoadingSpinner;
  