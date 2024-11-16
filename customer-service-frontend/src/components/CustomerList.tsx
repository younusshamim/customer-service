import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { customerApi } from '../api/customerApi';
import { useCustomer } from '../context/CustomerContext';
import { CustomerCard } from './CustomerCard';

export const CustomerList: React.FC = () => {
    const { customers, addCustomer } = useCustomer();

    const { isLoading, error, data } = useQuery({
        queryKey: ['customers'],
        queryFn: customerApi.getAllCustomers,
    });

    useEffect(() => {
        if (data) {
            data.forEach((customer) => {
                if (!customers.some((c) => c.id === customer.id)) {
                    addCustomer(customer);
                }
            });
        }
    }, [data, customers, addCustomer]);

    if (isLoading) return <div className="text-center py-4">Loading...</div>;
    if (error) return <div className="text-center py-4 text-red-500">Error loading customers</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {customers.map((customer) => (
                <CustomerCard key={customer.id} customer={customer} />
            ))}
        </div>
    );
};