import cron from "node-cron";
import axios from "axios";

const FLASK_API_URL = "http://localhost:5000/api/recommendations/newly_added";

// Schedule a task to run every day at 10 AM
const scheduleDailyRecommendationCheck = () => {
  // Define the cron expression for daily execution at 10 AM
  const cronExpression = "43 7 * * *";
  // const cronExpression = "* * * * *"; //minute hour day month year

  // Schedule the task
  cron.schedule(
    cronExpression,
    async () => {
      try {
        console.log("Executing scheduled task...");

        // Call the Flask API to trigger the recommendation process
        const response = await axios.get(FLASK_API_URL);
        console.log("Recommendations response:", response.data);

        // Handle the response if needed
        // For example, you can log it or perform additional operations if required
      } catch (error) {
        console.error("Failed to fetch recommendations from Flask API:", error);
      }
    },
    {
      timezone: "Asia/Kathmandu", // Adjust timezone as needed
    }
  );
};

export { scheduleDailyRecommendationCheck };
