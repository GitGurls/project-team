export default function Topbar() {
  return (
    <div className="w-full bg-white shadow p-4 flex justify-between">

      <h1 className="font-bold text-xl">
        Dashboard
      </h1>

      <button className="bg-red-500 text-white px-4 py-2 rounded">
        Logout
      </button>

    </div>
  );
}