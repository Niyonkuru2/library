import { useState, useEffect } from "react";
import { TailSpin } from "react-loader-spinner"; 
import SideBar from "../components/Sibebar";

const Reports = () => {
  const [reportType, setReportType] = useState("overdue"); 
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);

  // Simulate fetching reports data
  const fetchReportData = async (type) => {
    setFetching(true);
    setError(null);

    try {
      // Simulate an API request for report fetching
      setTimeout(() => {
        let data = [];
        if (type === "overdue") {
          data = [
            { id: 1, bookTitle: "1984", memberName: "Jane Smith", dueDate: "2024-12-10", daysOverdue: 5 },
            { id: 2, bookTitle: "The Great Gatsby", memberName: "John Doe", dueDate: "2024-12-01", daysOverdue: 10 },
          ];
        } else if (type === "unused") {
          data = [
            { id: 1, bookTitle: "Old Science Book", lastIssued: "2019-01-15", issueCount: 0 },
            { id: 2, bookTitle: "History of Art", lastIssued: "2020-04-20", issueCount: 0 },
          ];
        }
        setReportData(data);
      }, 2000); // Simulate a 2-second delay for fetching data
    } catch (err) {
      setError("Failed to fetch report data");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false); // Simulate a 2-second page load
    }, 2000); // Page-level load delay

    fetchReportData(reportType); // Fetch default report data
  }, []);

  useEffect(() => {
    if (!loading) {
      fetchReportData(reportType);
    }
  }, [reportType]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <TailSpin color="#4fa94d" height={80} width={80} />
      </div>
    );
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content Area */}
      <div className="flex-1 bg-gray-50 mt-10 ml-64 p-6 flex justify-center">
        <div className="w-full max-w-7xl">
          <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">Library Reports</h1>

          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700">Select Report Type:</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="border border-gray-300 rounded-md p-2"
              disabled={fetching}
            >
              <option value="overdue">Overdue Books</option>
              <option value="unused">Unused Books</option>
            </select>
          </div>

          {fetching ? (
            <div className="flex justify-center items-center h-64">
              <TailSpin color="#4fa94d" height={80} width={80} />
            </div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <div className="overflow-x-auto mt-6">
              <table className="min-w-full bg-white shadow-lg rounded-lg">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    {reportType === "overdue" ? (
                      <>
                        <th className="py-3 px-6 text-left">Book Title</th>
                        <th className="py-3 px-6 text-left">Member Name</th>
                        <th className="py-3 px-6 text-left">Due Date</th>
                        <th className="py-3 px-6 text-left">Days Overdue</th>
                      </>
                    ) : (
                      <>
                        <th className="py-3 px-6 text-left">Book Title</th>
                        <th className="py-3 px-6 text-left">Last Issued Date</th>
                        <th className="py-3 px-6 text-left">Issue Count</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((item) => (
                    <tr key={item.id} className="border-t">
                      {reportType === "overdue" ? (
                        <>
                          <td className="py-3 px-6">{item.bookTitle}</td>
                          <td className="py-3 px-6">{item.memberName}</td>
                          <td className="py-3 px-6">{item.dueDate}</td>
                          <td className="py-3 px-6">{item.daysOverdue}</td>
                        </>
                      ) : (
                        <>
                          <td className="py-3 px-6">{item.bookTitle}</td>
                          <td className="py-3 px-6">{item.lastIssued}</td>
                          <td className="py-3 px-6">{item.issueCount}</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
