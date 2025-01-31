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
    return data;
  } 
  catch (error) {
    console.error('Failed to set notification:', error);
    throw error;
  }
};


export const resetAdminNotification = async(memberType) => {
  try {
    const response = await fetch('/api/notification', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify({ memberType }), 
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json(); 
    return data;
  } 
  catch (error) {
    console.error('Failed to reset admin notification:', error);
    throw error;
  }
}

export const resetTeacherNotification = async(email, finalCount) => {
  try {
    const response = await fetch('/api/notification', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify({ email, finalCount }), 
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json(); 
    return data;
  } 
  catch (error) {
    console.error('Failed to reset admin notification:', error);
    throw error;
  }
}

export const getTeacherNotification = async (email) => {
  try {
    const response = await fetch("/api/register", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.notificationSeen || 0; 
  } catch (error) {
    console.error("Failed to fetch teacher notification count:", error);
    throw error;
  }
};
