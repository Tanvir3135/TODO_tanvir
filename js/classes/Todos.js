class Todos {
    #tasks = [];
    #backendUrl;
  
    constructor(backendUrl) {
      this.#backendUrl = backendUrl;
    }
  
    async getTasks() {
      try {
        const response = await fetch(`${this.#backendUrl}/`);
        const data = await response.json();
        this.#tasks = this.#readJson(data);
        return this.#tasks;
      } catch (error) {
        console.error('Error:', error);
        return [];
      }
    }

    async removeTask(id) {
        const response = await fetch(`${this.#backendUrl}/delete/${id}`, {
          method: 'DELETE',
        });
      
        if (response.ok) {
          this.#removeTaskFromArray(id);
          return id;
        } else {
          console.error('Failed to delete task');
          return null;
        }
      }

    #removeTaskFromArray(id) {
        this.#tasks = this.#tasks.filter(task => task.getId() !== id);
    }
  
    #readJson(data) {
      return data.map(item => new Task(item.id, item.description));
    }
  
    #addTaskToArray(task) {
      this.#tasks.push(task);
      return task;
    }
  
    async addTask(description) {
      const response = await fetch(`${this.#backendUrl}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description }),
      });
  
      if (response.ok) {
        const task = await response.json();
        return this.#addTaskToArray(new Task(task.id, task.description));
      } else {
        console.error('Failed to save task');
        return null;
      }
    }
  }
  
  export default Todos;