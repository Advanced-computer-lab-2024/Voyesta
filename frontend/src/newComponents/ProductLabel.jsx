import React, { useState } from "react";

function ProductLabel(props){
    // const [productName, setProductName] =  useState(props.value);
    // console.log(productName);
    return(
        <div className='flex flex-row content-center justify-between'>
            <div className='h-full p-4'>
              {props.title}
            </div>
            <input 
            className='bg-transparent w-2/3 border border-black rounded p-1 text-gray-400' 
            value={props.value} 
            type="textarea"
            // onChange={(e) => {props.setValue({ ...product, [props.value.toLowerCase()]: e.target.value })}
            onChange={(e) => {props.onChange(e.target.value)}}
            />
        </div>
    );
}

export default ProductLabel;

