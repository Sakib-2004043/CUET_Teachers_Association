export const setNotification = async (memberType) => {
  try {
    const response = await fetch('/api/notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify({ memberType }), 
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json(); 
    console.log('Notification set successfully:', data);
    return data;
  } 
  catch (error) {
    console.error('Failed to set notification:', error);
    throw error;
  }
};

export const getNotification = async () => {
  try {
    const response = await fetch('/api/notification'); // Adjust the API endpoint as necessary
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log(data.notifications)
    setNotificationCount(data.notifications.length); // Assuming the response structure has a notifications array
  } catch (error) {
    console.error("Error fetching notifications:", error);
  }
};