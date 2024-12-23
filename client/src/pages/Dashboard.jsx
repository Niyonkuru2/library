import SideBar from "../components/Sibebar";
import Statistics from "../components/Statistics";
import { useState, useEffect } from "react";

const Dashboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Example: Fetch users data and set it
    const fetchedUsers = [
      { id: 1, name: "John Doe", booksIssued: 3, department: "IT" },
      { id: 2, name: "Jane Smith", booksIssued: 2, department: "HR" },
    ];
    setUsers(fetchedUsers);  
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 p-6 space-y-8 mt-10">
        {/* Statistics Section */}
        <div>
          <Statistics />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
