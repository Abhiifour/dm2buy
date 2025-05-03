
'use client'

import { useEffect, useState } from "react"

export default  function Card({name , id} : any){
  
  const [productData , setProductData] = useState<any>([])
      
  
const getData = async() => {
    const data = await fetch(`https://api.dm2buy.com/v3/product/store/7dH0rzP3NJQeB8nC7zMsq6/collectionv2?page=1&limit=10&source=web&collectionId=${id}`).then((res:any) => res.json())

    // console.log(data.data.docs)
  

    if(data){
        setProductData((prev:any) => [...prev , ...data.data.docs])
    }
  }
  useEffect(()=>{
    getData()
  },[])
  
  
    return (
        <div className="w-full my-12 ">
             <h1 className="text-center text-xl my-8">{name}</h1>
             <div className="w-full h-fit flex justify-between gap-4 items-center overflow-x-auto">
             {
                productData.map((product:any)=> <div key={product.id+'abhishek'} className="w-[350px] ">
                    <div className="w-[290px] h-[300px] rounded-lg overflow-hidden mb-4">
                    <img src={product.productPhotos[0]} alt="image" className="w-full h-full"  />
                    </div>
                    <p className="text-lg font-medium">{product.name}</p>
                    {/* <p>{product.description}</p> */}

                </div>)
             }
             </div>
            
        </div>
    )
}