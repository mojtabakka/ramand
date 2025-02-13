
import Schedule from "./components/Schedule";

const App = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">جدول زمان بندی پویا</h1>
      <Schedule />
    </div>
  );
};

export default App;
