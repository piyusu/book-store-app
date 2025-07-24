import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react'
import page from '../about-us/page';

interface PaginationProps{
    currentPage: number;
    totalPages: number;
    onpageChange: (page:number) => void;
}
const Pagination : React.FC<PaginationProps> =({currentPage, totalPages, onpageChange})=> {
  return (
    <div className='flex items-center justify-center gap-2'>
        <Button variant='outline'
        size='icon'
        onClick={()=> onpageChange(Math.max(1, currentPage-1))}
        disabled={currentPage===1}
        >
            <ChevronLeft className='h-4 w-4'/>
        </Button>
        {Array.from({length:totalPages}, (_,i) => i+1).map((page) =>(
            <Button
            key={page}
            variant={currentPage === page ? 'default': 'outline'}
            className={currentPage === page ? 'bg-blue-500 text-black': ''}
            onClick={()=> onpageChange(page)}
            >
                {page}
            </Button>
        ))}
        <Button variant='outline'
        size='icon'
        onClick={()=> onpageChange(Math.min(totalPages, currentPage+1))}
        disabled={currentPage=== totalPages}
        >
            <ChevronRight className='h-4 w-4'/>
        </Button>
    </div>
  )
}

export default Pagination
