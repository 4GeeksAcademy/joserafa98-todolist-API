import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const TodoList = () => {
    const [inputValue, setInputValue] = useState('');
    const [tasks, setTasks] = useState([]);
    

    useEffect(() => {
        fetch("https://playground.4geeks.com/todo/users/joserafa98")
            .then(response => {
                if (!response.ok) throw new Error("Failed to fetch tasks");
                return response.json();
            })
            .then(data => {
                if (Array.isArray(data.todos)) { 
                    setTasks(data.todos);
                } else {
                    console.error("Data received is not an array:", data);
                }
            })
            .catch(error => console.error("Error fetching tasks:", error));
    }, []);

    
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue.trim() !== '') {
            const newTask = { label: inputValue, done: false };
            setInputValue('');

     
            const postData = {
                method: "POST",
                body: JSON.stringify(newTask),
                headers: {
                    "Content-Type": "application/json"
                }
            };

            fetch("https://playground.4geeks.com/todo/todos/joserafa98/", postData)
                .then(response => {
                    if (!response.ok) throw new Error("Failed to create task");
                    return response.json();
                })
                .then(data => {
            
                    setTasks(prevTasks => [...prevTasks, data]);
                })
                .catch(error => console.error("Error creating task:", error));
        }
    };


    const deleteTask = (index) => {
        const taskToDelete = tasks[index];
        const updatedTasks = tasks.filter((_, i) => i !== index);
        setTasks(updatedTasks);
    
        const deleteData = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        };
    
        fetch(`https://playground.4geeks.com/todo/todos/${taskToDelete.id}`, deleteData)
            .then(response => {
                if (!response.ok) throw new Error("Failed to delete task");
                return response.json();
            })
            .then(data => {
                console.log("Task deleted:", data);
            })
            .catch(error => console.error("Error deleting task:", error));
    };
    
    

    const deleteAllTasks = () => {
        if (tasks.length === 0) return;
    
       
        const deletePromises = tasks.map(task => {
            return fetch(`https://playground.4geeks.com/todo/todos/${task.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            });
        });
    
        Promise.all(deletePromises)
            .then(responses => {
                
                const allSuccessful = responses.every(response => response.ok);
                if (allSuccessful) {
                    console.log("All tasks deleted successfully");
                    setTasks([]); 
                } else {
                    console.error("Failed to delete some tasks");
                }
            })
            .catch(error => {
                console.error("Error deleting tasks:", error);
            });
    };
    
    

    return (
        <div className="container" id="todoList">
            <h1>To do List</h1>
            <ul>
                <li>
                    <input 
                        className="form-control form-control-lg" 
                        type="text" 
                        placeholder="Add your things here" 
                        aria-label=".form-control-lg example" 
                        onChange={e => setInputValue(e.target.value)} 
                        value={inputValue}
                        onKeyDown={handleKeyDown}
                    />
                </li>
                {tasks.map((task, index) => (
                    <li key={index}>
                        {task.label} 
                        <button className="deleteButton" onClick={() => deleteTask(index)}>
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    </li>
                ))}
            </ul>
            <div className="todoList-footer">{tasks.length} tasks left</div>
            <div><button type="button" className="btn btn-secondary" onClick={deleteAllTasks}> Delete All</button></div>
        </div>
    );
}

export default TodoList;
