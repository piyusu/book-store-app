import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookDetails } from '@/lib/types/type';
import {  useGetProductsQuery } from '@/store/api';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

const NewBooks = () => {
  const [currentBookSlide, setcurrentBookSlide] = useState(0);
  const {data:apiResponse={}, isLoading, isError} = useGetProductsQuery({})
  const [books,setBook] = useState<BookDetails[]>([]);
  
    useEffect(()=>{
      if(apiResponse?.success){
        setBook(apiResponse?.data)
      }
    },[apiResponse])

  useEffect(() => {
    const timer = setInterval(() => {
      setcurrentBookSlide((prev) => (prev + 1) % 3);
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(timer); // Cleanup the interval on component unmount
  })

  const prevSlide = () =>{
    setcurrentBookSlide((prev) => (prev -  1 + 3 ) % 3);
  }

  const nextSlide = () =>{
    setcurrentBookSlide((prev) => (prev + 1 ) % 3);
  }

  const calculateDiscount = (price: number, discount: number) :number => {
    if(price > discount && price > 0 ){
      return Math.round(((price - discount) / price) * 100);
    }
    return 0;
  }

  return (
    <section className='py-16 bg-gray-50'>
      <div className='container mx-auto lg:px-28 md:px-5'>
        <h2 className='text-3xl font-bold text-center mb-12'>Newly Added Books</h2>
        <div className='relative'>
          {books.length > 0 ? (
            <>
            <div className='overflow-hidden'>
              <div className='flex transition-transform duration-500 ease-in-out'
                style={{ transform: `translateX(-${currentBookSlide * 100}%)` }}>
                  {[0, 1, 2].map((slideIndex) =>(
                    <div key ={slideIndex} className='flex-none w-full'>
                      <div className='grid grid-col-1 md:grid-cols-3 gap-6'>
                        {books.slice(slideIndex, slideIndex + 3).map((book) => (
                          <Card key={book._id} className='relative'>
                            <CardContent className='p-4'>
                              <Link href={`books/${book._id}`}>
                              <div className='relative'>
                                <Image
                                src={book.images[0]}
                                alt={book.title}
                                width={200}
                                height={300}
                                className='mb-4 h-[200px] w-full object-cover rounded-md'
                                />
                                {calculateDiscount(book.price, book.finalPrice) > 0 && (
                                  <span className='absolute left-0 top-2 rounded-r-lg bg-red-500 px-2 py-1 text-xs font-medium text-white'>
                                    {calculateDiscount(book.price, book.finalPrice)}% OFF
                                  </span>
                                )}
                              </div>
                              <h3 className='mb-2 line-clamp-2 text-sm font-medium'>
                                {book.title}
                              </h3>
                              <div className='felx items-center justify-between'>
                                <div className='flex items-baseline gap-2'>
                                  <span className='text-lg font-bold'>₹{book.finalPrice}</span>
                                  {book.price && (
                                    <span className='text-sm text-muted-foreground line-through'>
                                      ₹{book.price}
                                    </span>
                                  )}
                                </div>
                                <div className='flex justify-between items-center text-xs text-zinc-400'>
                                  <span>{book.condition}</span>
                                </div>
                              </div>
                              <div className='pt-4'>
                                  <Button className='flex float-end mb-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-600'>
                                    Buy Now
                                  </Button>
                              </div>
                              </Link>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            {/* scroll button */}
            <button className='absolute left-0 top-1/2 -translate-1/2 bg-white p-2 rounded-full shadow-md'
              onClick={prevSlide}>
                <ChevronLeft className='h-6 w-6' />
            </button>
            <button className='absolute right-0 top-1/2 -translate-1/2 bg-white p-2 rounded-full shadow-md'
              onClick={nextSlide}>
                <ChevronRight className='h-6 w-6' />
            </button>

            {/* dot animation */}
            <div className='mt-8 flex justify-center space-x-2'>
              {[0, 1, 2].map((dot)=>(
                <button
                key={dot}
                onClick={()=>setcurrentBookSlide(dot)}
                className={`h-3 w-3 rounded-full ${currentBookSlide === dot ? 'bg-blue-500' : 'bg-gray-300'}`}
                ></button>
              ))}
            </div>
              </>
          ):(
            <p className='text-center text-gray-500'>No Books to display</p>
          )}
        </div>
      </div>
    </section>
  )
}

export default NewBooks
