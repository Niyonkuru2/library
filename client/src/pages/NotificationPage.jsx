import Notification from "../components/Notification";

const notificationsData = [
  {
    title: "Overdue Reminder",
    message: "The book 'Introduction to Algorithms' is overdue. Please return it immediately.",
    date: "2024-12-15",
  },
  {
    title: "Reserved Book Available",
    message: "The book 'The Great Gatsby' you reserved is now available for collection.",
    date: "2024-12-14",
  },
  {
    title: "System Maintenance",
    message: "The system will undergo maintenance on 2024-12-20 from 2:00 AM to 4:00 AM.",
    date: "2024-12-13",
  },
];

const NotificationsPage = () => {
  return (
    <div className="p-6 mt-8">
      <Notification notifications={notificationsData} />
    </div>
  );
};

export default NotificationsPage;
