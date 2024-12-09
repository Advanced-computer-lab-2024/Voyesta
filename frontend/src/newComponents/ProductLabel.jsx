// import React, { useState } from "react";

// function ProductLabel(props){
//     // const [productName, setProductName] =  useState(props.value);
//     // console.log(productName);
//     return(
//         <div className='flex flex-row content-center justify-between'>
//             <div className='h-full p-4'>
//               {props.title}
//             </div>
//             <input 
//             className='bg-transparent w-2/3 border border-black rounded p-1 text-gray-400' 
//             value={props.value} 
//             type="textarea"
//             // onChange={(e) => {props.setValue({ ...product, [props.value.toLowerCase()]: e.target.value })}
//             onChange={(e) => {props.onChange(e.target.value)}}
//             />
//         </div>
//     );
// }

// export default ProductLabel;


import React from "react";

function ProductLabel(props) {
  return (
    <div className='flex flex-col mb-4'>
      <label className='text-textOnCard font-bold mb-2'>{props.title}</label>
      <input 
        className='bg-white border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
        value={props.value} 
        type="text"
        onChange={(e) => {props.onChange(e.target.value)}}
      />
    </div>
  );
}

export default ProductLabel;
