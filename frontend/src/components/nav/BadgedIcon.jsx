export const BadgedIcon = ({ icon, count, onClick, className }) => (
    <button
      onClick={onClick}
      className={`relative p-2 text-gray-500 hover:text-blue-700 transition-colors duration-200 dark:text-gray-400 dark:hover:text-blue-500 ${className}`}
    >
      <i className={`fas ${icon} text-xl`}></i>
      {count > 0 && (
        <span className="absolute -top-2 -right-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
          {count}
        </span>
      )}
    </button>
  );