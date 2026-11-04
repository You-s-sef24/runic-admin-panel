export default function Header({ title }) {
  return (
    <header className="flex justify-between items-center bg-white dark:bg-gray-900 shadow border-b-2 border-gray-200 dark:border-gray-800">
      <div className="px-4 py-4">
        <h3 className="text-xl text-gray-900 dark:text-gray-100">{title}</h3>
      </div>
    </header>
  );
}
