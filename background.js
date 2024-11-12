chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name.startsWith('goal-')) {
    const goalId = parseInt(alarm.name.split('-')[1]);
    
    chrome.storage.sync.get(['goals'], (result) => {
      const goals = result.goals || [];
      const goal = goals.find(g => g.id === goalId);
      
      if (goal) {
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icon48.png',
          title: 'Goal Reminder',
          message: `Don't forget: ${goal.title}`,
          priority: 2
        });
      }
    });
  }
});