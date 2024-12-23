import { useState, useEffect } from "react";
import { TailSpin } from "react-loader-spinner";
import SideBar from "../components/Sibebar";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa"; // Import icons

const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [editMember, setEditMember] = useState(null); // Store member to be edited
  const [newMember, setNewMember] = useState({
    name: "",
    category: "", // Default empty category
  });

  // List of available categories
  const categories = ['Undergraduate', 'Postgraduate', 'Research Scholar', 'Faculty'];

  // Fetch data from the API
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get("https://library-8l38.onrender.com/api/member/getmember");
        setMembers(response.data); 
      } catch (err) {
        setError("Failed to fetch members");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const handleAddMember = async () => {
    try {
      const response = await axios.post("https://library-8l38.onrender.com/api/member/addmember", newMember);
      setMembers([...members, response.data.member]);
      setNewMember({ name: "", category: "" });
      setIsPopupOpen(false);
    } catch (err) {
      setError("Failed to add member");
    }
  };

  const handleEditMember = async () => {
    try {
      if (!editMember.membershipCode) {
        console.log("No membershipCode found for edit.");
        return;
      }

      const response = await axios.put(
        `http://localhost:9000/api/member/updatemember/${editMember.membershipCode}`,
        editMember
      );

      if (response.data && response.data.member) {
        const updatedMembers = members.map((member) =>
          member.membershipCode === editMember.membershipCode ? response.data.member : member
        );
        setMembers(updatedMembers); // Update the members list with the updated member
        setIsEditPopupOpen(false);
        setEditMember(null);
      } else {
        console.error("API did not return the updated member");
      }
    } catch (err) {
      setError("Failed to update member");
      console.error(err);
    }
  };

  const handleDeleteMember = async (membershipCode) => {
    try {
      await axios.delete(`http://localhost:9000/api/member/deletemember/${membershipCode}`);
      const updatedMembers = members.filter((member) => member.membershipCode !== membershipCode);
      setMembers(updatedMembers);
    } catch (err) {
      setError("Failed to delete member");
    }
  };

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
    <div className="flex">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content Area */}
      <div className="flex-1 bg-gray-50 p-6">
        <h1 className="text-3xl font-bold text-blue-600 mt-12 mb-6 text-center">Library Members</h1>

        {/* Button aligned to the right */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setIsPopupOpen(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Add New Member
          </button>
        </div>

        <div className="overflow-x-auto w-full max-w-7xl mx-auto">
          <table className="min-w-full bg-white shadow-lg rounded-lg mt-10">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-3 px-6 text-left">Membership Code</th>
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Category</th>
                <th className="py-3 px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member._id} className="border-t">
                  <td className="py-3 px-6">{member.membershipCode}</td>
                  <td className="py-3 px-6">{member.name}</td>
                  <td className="py-3 px-6">{member.category}</td>
                  <td className="py-3 px-6 flex justify-start space-x-4">
                    {/* Edit Button */}
                    <button
                      onClick={() => {
                        setEditMember({ ...member }); // Populate the edit form with the selected member's data
                        setIsEditPopupOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 text-lg"
                    >
                      <FaEdit />
                    </button>
                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteMember(member.membershipCode)} // Use membershipCode here
                      className="text-red-600 hover:text-red-800 text-lg"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Popup for Adding New Member */}
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md transform transition-all">
            <h2 className="text-lg font-bold mb-4">Add New Member</h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddMember();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  className="w-full border rounded-md p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  value={newMember.category}
                  onChange={(e) => setNewMember({ ...newMember, category: e.target.value })}
                  className="w-full border rounded-md p-2"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsPopupOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Popup for Editing Member */}
      {isEditPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md transform transition-all">
            <h2 className="text-lg font-bold mb-4">Edit Member</h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditMember(); // Trigger the API call to update the member
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={editMember.name}
                  onChange={(e) => setEditMember({ ...editMember, name: e.target.value })}
                  className="w-full border rounded-md p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  value={editMember.category}
                  onChange={(e) => setEditMember({ ...editMember, category: e.target.value })}
                  className="w-full border rounded-md p-2"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsEditPopupOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;
