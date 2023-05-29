import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Todo from './components/Todo';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <Todo />
      </div>
    </QueryClientProvider>
  );
}

export default App;