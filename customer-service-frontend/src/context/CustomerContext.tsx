import React, { createContext, useContext, useState } from 'react';
import { Customer } from '../types/customer';

interface CustomerContextType {
    customers: Customer[];
    updateCustomer: (customer: Customer) => void;
    addCustomer: (customer: Customer) => void;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export const CustomerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [customers, setCustomers] = useState<Customer[]>([]);

    const updateCustomer = (updatedCustomer: Customer) => {
        setCustomers(prev =>
            prev.map(customer =>
                customer.id === updatedCustomer.id ? updatedCustomer : customer
            )
        );
    };

    const addCustomer = (customer: Customer) => {
        setCustomers(prev => [...prev, customer]);
    };

    return (
        <CustomerContext.Provider value={{ customers, updateCustomer, addCustomer }}>
            {children}
        </CustomerContext.Provider>
    );
};

export const useCustomer = () => {
    const context = useContext(CustomerContext);
    if (!context) {
        throw new Error('useCustomer must be used within a CustomerProvider');
    }
    return context;
};