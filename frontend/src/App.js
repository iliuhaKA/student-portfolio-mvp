import logo from './logo.svg';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <img src={logo} className="h-24 w-24 mx-auto mb-4 animate-spin" alt="logo" />
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Student Portfolio MVP
        </h1>
        <p className="text-gray-600 mb-4">
          Edit <code className="bg-gray-200 px-2 py-1 rounded">src/App.js</code> and save to reload.
        </p>
        <a
          className="text-blue-600 hover:text-blue-800 underline font-medium"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </div>
    </div>
  );
}

export default App;
