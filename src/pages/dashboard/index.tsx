'use client';

import type { Metadata } from "next";
import withAuth from "@/components/withAuth";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import DemographicCard from "@/components/ecommerce/DemographicCard";

import React from "react";


export const metadata: Metadata = {
    title:
        "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
    description: "This is Next.js Home for TailAdmin Dashboard Template",
};

function Ecommerce() {
    return (
        <main className="flex-1 p-6 overflow-auto bg-gray-100">
            <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6 border border-gray-300 min-h-[calc(110vh-6rem)]">
                <div className="grid grid-cols-12 gap-4 md:gap-6">
                    <div className="col-span-12 space-y-6 xl:col-span-7 text-gray-900" >
                        <EcommerceMetrics />

                        <MonthlySalesChart />
                    </div>

                    <div className="col-span-12 xl:col-span-5 text-gray-900">
                        <MonthlyTarget />
                    </div>

                    <div className="col-span-12">
                        <StatisticsChart />
                    </div>
                </div>
            </div>
        </main>
    );
}

export default withAuth(Ecommerce);