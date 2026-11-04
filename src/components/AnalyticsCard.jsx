export default function AnalyticsCard({ title, value, icon }) {
  return (
    <div className="flex justify-between bg-white dark:bg-gray-900 shadow rounded-lg p-4 sm:p-6 xl:p-8 hover:scale-105 transition-all">
      <div>
        <p className="text-lg text-gray-900 dark:text-gray-100">{title}</p>
        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">
          {value}
        </p>
      </div>
      <div className="mt-4 flex items-center">
        <div className="p-3 rounded-lg text-blue-800 dark:text-blue-300 bg-blue-200 dark:bg-blue-950 flex-shrink-0">
          {icon}
        </div>
      </div>
    </div>
  );
}
