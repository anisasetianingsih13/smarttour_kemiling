export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Dashboard</h1>
      <p className="text-gray-500 mb-8">Selamat datang di CMS SmartTour Kemiling</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <p className="text-sm text-gray-500">Total Tempat Wisata</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">-</p>
          <p className="text-xs text-gray-400 mt-1">Data dari Tourism Service</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <p className="text-sm text-gray-500">Wisata Indoor</p>
          <p className="text-3xl font-bold text-green-600 mt-2">-</p>
          <p className="text-xs text-gray-400 mt-1">Sesuai filter cuaca</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <p className="text-sm text-gray-500">Wisata Outdoor</p>
          <p className="text-3xl font-bold text-orange-600 mt-2">-</p>
          <p className="text-xs text-gray-400 mt-1">Sesuai filter cuaca</p>
        </div>
      </div>
    </div>
  );
}
