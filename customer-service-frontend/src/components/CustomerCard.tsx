import API_URL from '@/api/apiUrl';
import { useCustomer } from '@/context/CustomerContext';
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Customer } from '../types/customer';

interface CustomerCardProps {
    customer: Customer;
}

export const CustomerCard: React.FC<CustomerCardProps> = ({ customer }) => {
    const [timeLeft, setTimeLeft] = useState<number>(customer.waitTime);
    const [socket] = useState(() => io(API_URL));
    const { updateCustomer } = useCustomer();

    useEffect(() => {
        if (customer.status === 'waiting') {
            const timer = setInterval(() => {
                setTimeLeft((prev) => Math.max(0, prev - 1));
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [customer.status]);

    useEffect(() => {
        socket.on(`customer-${customer.id}-update`, (updatedCustomer: Customer) => {
            updateCustomer(updatedCustomer);
            console.log('Customer updated:', updatedCustomer);
        });

        return () => {
            socket.off(`customer-${customer.id}-update`);
        };
    }, [customer.id, socket]);

    const getStatusColor = () => {
        switch (customer.status) {
            case 'waiting':
                return 'bg-yellow-100 border-yellow-300';
            case 'serving':
                return 'bg-green-100 border-green-300';
            case 'completed':
                return 'bg-gray-100 border-gray-300';
            default:
                return 'bg-white border-gray-200';
        }
    };

    return (
        <div className={`p-4 border rounded-lg shadow-sm ${getStatusColor()}`}>
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">{customer.name}</h3>
                <span className="px-2 py-1 text-sm rounded bg-blue-500 text-white">
                    {customer.token}
                </span>
            </div>
            <div className="space-y-2">
                <p className="text-sm">
                    Status: <span className="font-medium">{customer.status}</span>
                </p>
                {customer.status === 'waiting' && timeLeft > 0 && (
                    <p className="text-sm">
                        Wait time: <span className="font-medium">{timeLeft}s</span>
                    </p>
                )}
                {customer.representative && (
                    <p className="text-sm">
                        Representative: <span className="font-medium">{customer.representative}</span>
                    </p>
                )}
            </div>
        </div>
    );
};