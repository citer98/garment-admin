export default function StatCard({ title, value, trend, icon, className = '' }) {
  return (
    <div className={`bg-white rounded-xl p-4 sm:p-5 md:p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 ${className}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm text-gray-500 font-medium truncate">{title}</p>
          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mt-1 sm:mt-2 truncate">
            {value}
          </p>
          {trend !== undefined && trend !== null && (
            <div className={`inline-flex items-center mt-1 sm:mt-2 text-xs sm:text-sm ${
              trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-500'
            }`}>
              {trend > 0 ? '↗' : trend < 0 ? '↘' : '→'} 
              {trend !== 0 && ` ${Math.abs(trend)}%`}
              {trend === 0 && ' 0%'}
            </div>
          )}
        </div>
        {icon && (
          <div className="ml-3 flex-shrink-0 p-2 sm:p-3 bg-blue-50 rounded-lg">
            <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex items-center justify-center">
              {icon}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}