'use client'

import { NextPage } from 'next'
import { useTheme } from 'next-themes'
import { FaMoon } from 'react-icons/fa'
import { IoSunny } from 'react-icons/io5'

const Navbar: NextPage = ({ }) => {
    const { theme, setTheme } = useTheme()
    return (
        <nav className='py-10 flex justify-between items-center text-white dark:text-white'>
            <h1 className='text-4xl font-bold tracking-[10px] select-none'>TODO</h1>
            <div onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className='hover:bg-[#0202023d] w-9 md:w-8 h-9 md:h-8 rounded-full duration-300 flex justify-center items-center cursor-pointer relative'>
                <IoSunny className='p-1.5 w-full h-full opacity-0 dark:opacity-100 absolute duration-300' />
                <FaMoon className='p-1.5 w-full h-full opacity-100 dark:opacity-0 absolute duration-300' />
            </div>
        </nav>
    )
}

export default Navbar