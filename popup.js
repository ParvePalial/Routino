document.addEventListener('DOMContentLoaded', () => {
    const addGoalBtn = document.getElementById('addGoal');
    const goalsList = document.getElementById('goals');
    
    // Load existing goals
    loadGoals();
    
    addGoalBtn.addEventListener('click', () => {
      const title = document.getElementById('goalTitle').value;
      const description = document.getElementById('goalDescription').value;
      const deadline = document.getElementById('goalDeadline').value;
      
      if (!title || !deadline) {
        alert('Please fill in all required fields');
        return;
      }
      
      const goal = {
        id: Date.now(),
        title,
        description,
        deadline,
        completed: false
      };
      
      saveGoal(goal);
      loadGoals();
      resetForm();
    });
    
    function saveGoal(goal) {
      chrome.storage.sync.get(['goals'], (result) => {
        const goals = result.goals || [];
        goals.push(goal);
        chrome.storage.sync.set({ goals });
        
        // Set alarm for reminder
        chrome.alarms.create(`goal-${goal.id}`, {
          when: new Date(goal.deadline).getTime()
        });
      });
    }
    
    function loadGoals() {
      chrome.storage.sync.get(['goals'], (result) => {
        const goals = result.goals || [];
        displayGoals(goals);
      });
    }
    
    function displayGoals(goals) {
      goalsList.innerHTML = '';
      goals.forEach(goal => {
        const goalElement = document.createElement('div');
        goalElement.className = 'goal-item';
        goalElement.innerHTML = `
          <div>
            <strong>${goal.title}</strong>
            <p>${goal.description}</p>
            <small>Due: ${new Date(goal.deadline).toLocaleString()}</small>
          </div>
          <span class="delete-btn" data-id="${goal.id}">×</span>
        `;
        goalsList.appendChild(goalElement);
      });
      
      // Add delete handlers
      document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const goalId = parseInt(e.target.dataset.id);
          deleteGoal(goalId);
        });
      });
    }
    
    function deleteGoal(goalId) {
      chrome.storage.sync.get(['goals'], (result) => {
        const goals = result.goals || [];
        const updatedGoals = goals.filter(goal => goal.id !== goalId);
        chrome.storage.sync.set({ goals: updatedGoals });
        
        // Remove alarm
        chrome.alarms.clear(`goal-${goalId}`);
        
        loadGoals();
      });
    }
    
    function resetForm() {
      document.getElementById('goalTitle').value = '';
      document.getElementById('goalDescription').value = '';
      document.getElementById('goalDeadline').value = '';
    }
  });