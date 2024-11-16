import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CustomerForm } from './components/CustomerForm';
import { CustomerList } from './components/CustomerList';
import { CustomerProvider } from './context/CustomerContext';

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <CustomerProvider>
        <div className="min-h-screen bg-gray-100">
          <div className="container mx-auto py-8 px-8 xl:px-60">
            <h1 className="text-3xl font-bold text-center mb-8">
              Customer Service
            </h1>
            <CustomerForm />
            <CustomerList />
          </div>
        </div>
      </CustomerProvider>
    </QueryClientProvider>
  );
};

export default App;