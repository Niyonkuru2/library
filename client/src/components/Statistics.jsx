const Statistics = () => {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });
  const formattedTime = currentDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dayOfWeek = currentDate.toLocaleDateString("en-US", { weekday: "long" });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Greeting Section */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">
          Hello, <span className="text-red-500"></span>
        </h1>
        <p className="text-gray-500">
          {formattedDate} | {dayOfWeek}, {formattedTime}
        </p>
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Visitors */}
        <div className="bg-white shadow-md p-6 rounded-lg flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold">12,325</p>
            <p className="text-gray-500">Total Visitors</p>
          </div>
          <div className="w-10 h-10 bg-black text-white flex items-center justify-center rounded-full">
            <span className="text-xl">&#128101;</span>
          </div>
        </div>

        {/* Borrowed Books */}
        <div className="bg-white shadow-md p-6 rounded-lg flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold">1000</p>
            <p className="text-gray-500">Borrowed Books</p>
          </div>
          <div className="w-10 h-10 bg-black text-white flex items-center justify-center rounded-full">
            <span className="text-xl">&#128218;</span>
          </div>
        </div>

        {/* New Members */}
        <div className="bg-white shadow-md p-6 rounded-lg flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold">100</p>
            <p className="text-gray-500">New Members</p>
          </div>
          <div className="w-10 h-10 bg-black text-white flex items-center justify-center rounded-full">
            <span className="text-xl">&#128101;</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
