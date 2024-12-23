import { useState, useEffect } from "react";
import { TailSpin } from "react-loader-spinner";
const Notification = ({ notifications = [] }) => {
  const [fetchedNotifications, setFetchedNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(new Set());
  const [error, setError] = useState(null);

  // Simulate fetching notifications
  useEffect(() => {
    setTimeout(() => {
      try {
        // Simulate API response or assign notifications prop
        setFetchedNotifications(notifications);
      } catch (err) {
        setError("Failed to fetch notifications.");
      } finally {
        setLoading(false);
      }
    }, 2000); // Simulate a 2-second delay for fetching
  }, [notifications]);

  // Dismiss a notification
  const dismissNotification = (index) => {
    setDismissed((prev) => new Set(prev).add(index));
  };

  // Render active notifications, filtering out dismissed ones
  const activeNotifications = fetchedNotifications.filter(
    (_, index) => !dismissed.has(index)
  );

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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">Notifications</h1>
      {activeNotifications.length === 0 ? (
        <p className="text-gray-500">No new notifications.</p>
      ) : (
        <ul className="space-y-4">
          {activeNotifications.map((notification, index) => (
            <li
              key={index}
              className="bg-white shadow-md p-4 rounded-md flex justify-between items-center"
            >
              <div>
                <h2 className="text-lg font-medium">{notification.title}</h2>
                <p className="text-gray-600">{notification.message}</p>
                <p className="text-sm text-gray-400">{notification.date}</p>
              </div>
              <button
                onClick={() => dismissNotification(index)}
                className="text-red-600 hover:text-red-800 font-bold"
              >
                Dismiss
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notification;
