'use client'

import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { FaCheck, FaChevronDown, FaChevronUp, FaPlus, FaTimes } from 'react-icons/fa'
import { twMerge } from 'tailwind-merge'

interface TodoTypes {
    message: string,
    status: 'completed' | 'pending',
    id: number
}

const Todo: NextPage = ({ }) => {
    const [todos, setTodos] = useState<TodoTypes[]>([])
    const [liveTodos, setLiveTodos] = useState<TodoTypes[]>([])
    const [selectedSection, setSelectedSection] = useState<'all' | 'active' | 'completed'>('all')
    const [inputValue, setInputValue] = useState<string>('')
    const [todosLeft, setTodosLeft] = useState<number>(0)
    const [firstRenderDone, setFirstRenderDone] = useState<boolean>(false)

    // for setting initial value
    useEffect(() => {
        setFirstRenderDone(true)
        const localStorageData = localStorage.getItem('todos') || '[]'
        const parsedData = JSON.parse(localStorageData)
        setTodos(parsedData)
    }, [])

    // for getting how much todo is left to do
    useEffect(() => {
        const activeTodos = todos.filter((todo: TodoTypes) => todo.status === 'pending')
        const completedTodos = todos.filter((todo: TodoTypes) => todo.status === 'completed')
        setTodosLeft(activeTodos.length)
        if (selectedSection === 'all') setLiveTodos(todos)
        else if (selectedSection === 'active') setLiveTodos(activeTodos)
        else if (selectedSection === 'completed') setLiveTodos(completedTodos)

        // saving the data to localstorage
        if (firstRenderDone) localStorage.setItem('todos', JSON.stringify(todos))
    }, [todos, selectedSection, firstRenderDone])

    // for adding a new todo
    const addTodoHandler = (e: React.MouseEvent<HTMLFormElement>) => {
        e.preventDefault()
        setTodos((prevTodos: TodoTypes[]) => {
            return [...prevTodos, { message: inputValue, status: 'pending', id: Math.random() * 1000000 }]
        })
        setInputValue('')
    }

    //for removing all todos that are completed
    const clearCompletedhandler = () => {
        setTodos((prevTodos: TodoTypes[]) => {
            const newTodos: TodoTypes[] = prevTodos.filter((todo: TodoTypes) => todo.status === 'pending')
            return newTodos;
        })
    }
    return (
        <div className='flex flex-col gap-5 mb-5 h-full overflow-auto select-none'>
            <form onSubmit={addTodoHandler} className='w-full h-14 primary-bg rounded-md primary-text flex justify-center items-center px-5 gap-3'>
                <div className='w-7 h-7 border primary-border rounded-full' />
                <input
                    type="text"
                    placeholder='Create a new todo...'
                    onChange={(e) => setInputValue(e.target.value)}
                    className='bg-transparent placeholder:text-slate-500 dark:placeholder:text-slate-400 placeholder:duration-300 duration-300 flex-1 w-full h-full outline-none'
                    maxLength={75}
                    value={inputValue}
                    required
                />
                <button type='submit' className='cursor-pointer primary-text'>
                    <FaPlus className='w-6 h-6' />
                </button>
            </form>
            <div className='w-full h-full primary-bg rounded-md primary-text flex-1 flex flex-col overflow-auto'>
                <div className=' overflow-auto flex flex-col h-full'>
                    {
                        liveTodos.length === 0 ? <p className='w-full h-full flex justify-center items-center'>No todos left!</p> :
                            <TodoLists data={liveTodos} setTodos={setTodos} setLiveTodos={setLiveTodos} selectedSection={selectedSection} />
                    }
                </div>
                <div className={twMerge('w-full h-auto min-h-14 py-3 primary-bg primary-text flex justify-between items-center px-5 gap-3 border-t secondary-border')}>
                    <p>{todosLeft} items left</p>
                    <div className='w-full primary-bg rounded-md primary-text flex-1 items-center justify-center gap-4 select-none hidden md:flex'>
                        <p onClick={() => setSelectedSection('all')} className={twMerge('cursor-pointer text-lg font-medium', selectedSection === 'all' && 'text-blue-500')}>All</p>
                        <p onClick={() => setSelectedSection('active')} className={twMerge('cursor-pointer text-lg font-medium', selectedSection === 'active' && 'text-blue-500')}>Active</p>
                        <p onClick={() => setSelectedSection('completed')} className={twMerge('cursor-pointer text-lg font-medium', selectedSection === 'completed' && 'text-blue-500')}>Completed</p>
                    </div>
                    <span onClick={clearCompletedhandler} className='cursor-pointer'>Clear Completed</span>
                </div>
            </div>
            <div className='w-full h-14 primary-bg rounded-md primary-text flex items-center justify-center gap-4 select-none md:hidden'>
                <p onClick={() => setSelectedSection('all')} className={twMerge('cursor-pointer text-lg font-medium', selectedSection === 'all' && 'text-blue-500')}>All</p>
                <p onClick={() => setSelectedSection('active')} className={twMerge('cursor-pointer text-lg font-medium', selectedSection === 'active' && 'text-blue-500')}>Active</p>
                <p onClick={() => setSelectedSection('completed')} className={twMerge('cursor-pointer text-lg font-medium', selectedSection === 'completed' && 'text-blue-500')}>Completed</p>
            </div>
            <p className='text-center primary-text hidden lg:block'>Drag and drop to reorder list</p>
        </div>
    )
}

export default Todo

interface TodoListsTypes {
    data: TodoTypes[],
    setTodos: React.Dispatch<React.SetStateAction<TodoTypes[]>>,
    setLiveTodos: (e: TodoTypes[]) => void,
    selectedSection: string
}

const TodoLists = ({ data, setTodos, setLiveTodos, selectedSection }: TodoListsTypes) => {
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);


    // for removing a todo
    const removeTodoHandler = (id: number) => {
        setTodos((prevTodos: TodoTypes[]) => {
            const newTodos: TodoTypes[] = prevTodos.filter((todo: TodoTypes) => todo.id !== id)
            return newTodos
        })
    }

    // for changing the status of a todo
    const statusChangeHandler = (id: number, status: 'completed' | 'pending') => {
        setTodos((prevTodos: TodoTypes[]) => {
            const index = prevTodos.findIndex((todo: TodoTypes) => todo.id === id)
            const newTodos: TodoTypes[] = [...prevTodos]
            newTodos[index].status = status
            return newTodos;
        })
    }


    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (index: number) => {
        if (draggedIndex !== null) {
            const newTodos = [...data];
            const [movedItem] = newTodos.splice(draggedIndex, 1);
            newTodos.splice(index, 0, movedItem);
            setTodos(newTodos);
            setDraggedIndex(null);
        }
    };

    const serialUp = (index: number) => {
        if (index !== 0) {
            const newTodos = [...data]
            const [movedItem] = newTodos.splice(index, 1);
            newTodos.splice(index - 1, 0, movedItem)
            if (selectedSection === 'all') setTodos(newTodos)
            setLiveTodos(newTodos)
        }
    }

    const serialDown = (index: number) => {
        if (data.length !== index + 1) {
            const newTodos = [...data]
            const [movedItem] = newTodos.splice(index, 1);
            newTodos.splice(index + 1, 0, movedItem)
            if (selectedSection === 'all') setTodos(newTodos)
            setLiveTodos(newTodos)
        }
    }

    return (
        <>
            {data.map((todo: TodoTypes, index: number) => (
                <div
                    key={todo.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(index)}
                    className={twMerge('w-full h-auto min-h-[56px] primary-bg primary-text flex justify-center items-center px-5 gap-2.5 lg:gap-3 border-b secondary-border')}
                >
                    <div className='flex flex-col h-9 justify-between lg:hidden primary-text'>
                        <FaChevronUp onClick={() => serialUp(index)} className={twMerge(' cursor-pointer', index === 0 && 'opacity-30 cursor-default')} />
                        <FaChevronDown onClick={() => serialDown(index)} className={twMerge(' cursor-pointer', data.length === index + 1 && 'opacity-30 cursor-default')} />
                    </div>
                    <div
                        onClick={() => statusChangeHandler(todo.id, todo.status === 'pending' ? 'completed' : 'pending')}
                        className={twMerge('w-7 h-7 border primary-border rounded-full cursor-pointer flex justify-center items-center overflow-hidden')}
                    >
                        <FaCheck className={twMerge('text-white dark:text-white linear-bg w-full h-full p-1.5 opacity-0 duration-300', todo.status === 'completed' && 'opacity-100')} />
                    </div>
                    <p className={twMerge('w-full secondary-text flex-1 text-sm md:text-base', todo.status === 'completed' && 'opacity-30 line-through')}>{todo.message}</p>
                    <span className='cursor-pointer primary-text' onClick={() => removeTodoHandler(todo.id)}>
                        <FaTimes className='w-6 h-6' />
                    </span>
                </div>
            ))}
        </>
    )
}