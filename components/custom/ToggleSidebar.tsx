"use client"

import React from 'react'
import { useSidebar } from '../ui/sidebar';
import {  IndentDecrease, IndentIncrease } from 'lucide-react';

function ToggleSidebar() {
 
    const { toggleSidebar, open } = useSidebar();
  return (
    <div className='pb-3'>
      {open ? <IndentDecrease onClick={toggleSidebar}/> :<IndentIncrease onClick={toggleSidebar}/> } 
    </div>
  )
}

export default ToggleSidebar
