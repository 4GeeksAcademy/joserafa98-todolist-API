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

    useEffect(() => {
        if (tasks.length === 0) return; 

        const putData = {
            method: "PUT",
            body: JSON.stringify({ todos: tasks }), 
            headers: {
                "Content-Type": "application/json"
            }
        };

        fetch("https://playground.4geeks.com/todo/users/joserafa98", putData)
            .then(response => {
                if (!response.ok) throw new Error("Failed to update tasks");
                return response.json();
            })
            .then(data => {
                console.log("Tasks updated:", data);
            })
            .catch(error => console.error("Error updating tasks:", error));
    }, [tasks]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue.trim() !== '') {
            setTasks([...tasks, { label: inputValue, done: false }]);
            setInputValue('');
        }
    };
    
    const deleteTask = (index) => {
        const updatedTasks = tasks.filter((_, i) => i !== index);
        setTasks(updatedTasks);
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
        </div>
    );
}

export default TodoList;

