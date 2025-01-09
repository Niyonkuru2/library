import { useState, useEffect } from "react";
import { TailSpin } from "react-loader-spinner"; 
import SideBar from "../components/Sibebar";
import axios from 'axios';

const Issues = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIssues = async () => {
      setLoading(true); 
      try {
        const response = await axios.get('https://library-8l38.onrender.com/api/transaction/gettransactions');
        const data = response.data;

        if (data && Array.isArray(data)) {
          const fetchedIssues = data.map(issue => ({
            id: issue._id,
            bookTitle: issue.isbn,  
            memberName: issue.membershipCode, 
            issueDate: new Date(issue.issueDate).toLocaleDateString(),
            dueDate: new Date(issue.dueDate).toLocaleDateString(),
            penalty: issue.penalty,
          }));

          setIssues(fetchedIssues);  
        } else {
          setError("Failed to fetch issues"); 
        }
      } catch (err) {
        setError("Failed to fetch issues"); 
      } finally {
        setLoading(false);  
      }
    };

    fetchIssues();
  }, []); 

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <TailSpin color="#4fa94d" height={80} width={80} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-row w-full mt-0">
      <SideBar />
      <div className="flex flex-col w-full justify-center items-center p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 mt-8 text-center">Issued Books</h1>
        <div className="overflow-x-auto w-full">
          <table className="min-w-full bg-white shadow-lg rounded-lg">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-3 px-6 text-left">Book ISBN</th>
                <th className="py-3 px-6 text-left">Member Code</th>
                <th className="py-3 px-6 text-left">Issue Date</th>
                <th className="py-3 px-6 text-left">Due Date</th>
                <th className="py-3 px-6 text-left">Penalty</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue) => (
                <tr key={issue.id} className="border-t">
                  <td className="py-3 px-6">{issue.isbn}</td>
                  <td className="py-3 px-6">{issue.memberName}</td>
                  <td className="py-3 px-6">{issue.issueDate}</td>
                  <td className="py-3 px-6">{issue.dueDate}</td>
                  <td className="py-3 px-6">{issue.penalty} USD</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Issues;
