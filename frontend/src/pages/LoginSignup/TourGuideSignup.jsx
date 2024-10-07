// import React from "react";

// function TourGuideSignup({username, email, password}){

//     return(
//       <div className="relative text-center bg-white shadow rounded p-3 w-2/5 mx-auto">
//         <h1 className="text-2xl text-gray-600 font-bold mb-3">Signup</h1>
//         <form onSubmit={handleSubmit}className="flex flex-col gap-4">
//           <div>
//             <label htmlFor="username" className="block text-sm font-medium text-gray-700">
//               Username
//             </label>
//             <input
//               type="text"
//               id="username"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
//               required
//             />
//           </div>

//           <div>
//             <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//               Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
//               required
//             />
//           </div>

//           <div>
//             <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
//               required
//             />
//           </div>

//           <div>
//             <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">
//               Mobile Number
//             </label>
//             <input
//               type="text"
//               id="mobileNumber"
//               value={mobileNumber}
//               onChange={(e) => setMobileNumber(e.target.value)}
//               className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
//               required
//             />
//           </div>

//           <div>
//             <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700">
//               Years of Experience
//             </label>
//             <input
//               type="text"
//               id="yearsOfExperience"
//               value={yearsOfExperience}
//               onChange={(e) => setYearsOfExperience(e.target.value)}
//               className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
//               required
//             />
//           </div>

//           <div>
//             <label htmlFor="previousWork" className="block text-sm font-medium text-gray-700">
//               Previous Work
//             </label>
//             <textarea
//               id="previousWork"
//               value={previousWork}
//               onChange={(e) => setPreviousWork(e.target.value)}
//               className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             className="bg-blue-500 text-white rounded-lg p-2 mt-4 hover:bg-blue-700"
//           >
//             Signup
//           </button>
//         </form>
//       </div>
//     );
// }

// export default TourGuideSignup;