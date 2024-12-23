import Subscription from '../models/subscribe.js'
const addSubscription = async (req, res) => {
    try {
      const { userId, category, duration, date } = req.body;
  
      if (!category || !duration || !date) {
        return res.status(400).json({ message: 'All fields are required.' });
      }
  
      const subscription = new Subscription({
        category,
        duration,
        date,
      });
  
      await subscription.save();
      res.status(201).json({ message: 'Subscription created successfully.', subscription });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to create subscription.' });
    }
  };

  export {addSubscription}