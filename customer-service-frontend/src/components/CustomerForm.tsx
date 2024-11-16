import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import { customerApi } from '../api/customerApi';
import { useCustomer } from '../context/CustomerContext';

export const CustomerForm: React.FC = () => {
    const [name, setName] = useState('');
    const { addCustomer } = useCustomer();

    const createCustomerMutation = useMutation({
        mutationFn: customerApi.createCustomer,
        onSuccess: (newCustomer) => {
            addCustomer(newCustomer);
            setName('');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            createCustomerMutation.mutate(name);
        }
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow">
            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter customer name"
                    className="flex-1 px-4 py-2 border rounded"
                />
                <button
                    type="submit"
                    disabled={createCustomerMutation.isPending}
                    className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-blue-300"
                >
                    {createCustomerMutation.isPending ? 'Adding...' : 'Add Customer'}
                </button>
            </form>
        </div>
    );
};