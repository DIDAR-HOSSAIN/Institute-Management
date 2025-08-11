import React from "react";
import DashboardCard from "@/backend/Dashboard/DashboardCard";
import AdminDashboardLayout from "@/backend/Dashboard/AdminDashboardLayout"
import { Head } from "@inertiajs/react";
import dashboard1 from "@/assets/images/Dashboard/income.jpg";
import dashboard2 from "@/assets/images/Dashboard/expenses.jpg";
import dashboard3 from "@/assets/images/Dashboard/dues.jpg";
import dashboard4 from "@/assets/images/Dashboard/discount.jpg";
import dashboard5 from "@/assets/images/Dashboard/mobile-banking.jpg";
import dashboard6 from "@/assets/images/Dashboard/users.png";

const Dashboard = ({ auth }) => {
     const cardsData = [
        { id: 1, title: 'Income:', description: 'Description for Card 1', imageUrl: dashboard1 },
        { id: 2, title: 'Expense:', description: 'Description for Card 2', imageUrl: dashboard2 },
        { id: 3, title: 'Dues:', description: 'Description for Card 2', imageUrl: dashboard3 },
        { id: 4, title: 'Discount:', description: 'Description for Card 2', imageUrl: dashboard4 },
        { id: 5, title: 'Mobile Banking:', description: 'Description for Card 2', imageUrl: dashboard5 },
        { id: 6, title: 'Users:', description: 'Description for Card 2', imageUrl: dashboard6 },
        // Add more card data as needed
    ];

    return (
        <AdminDashboardLayout
            user={auth.user}
            header={
                <h1 className="font-semibold text-xl text-gray-800 leading-tight">
                    Dashboard
                </h1>
            }
        >
            <Head title="Dashboard" />

            <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 justify-center">
                {cardsData.map((card) => (
                    <div key={card.id} className="m-2">
                        <DashboardCard {...card} />
                    </div>
                ))}
            </div>
        </AdminDashboardLayout>
    );
};

export default Dashboard;
