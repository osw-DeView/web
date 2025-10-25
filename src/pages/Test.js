function Test() {
  return (
    <div className="flex items-center justify-center min-h-screen-minus-navbar bg-gray-100">
      
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm">
        
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
          Tailwind Test Card
        </h2>
        
        <div className="mb-4">
          <input 
            type="text" 
            id="text" 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out" 
          />
        </div>
        
        <button 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105"
        >
          제출하기
        </button>
        
      </div>
    </div>
  );
}

export default Test;