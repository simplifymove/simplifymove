import { useState } from 'react';
import { Card } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { WalletManagementAdmin } from './WalletManagementAdmin';
import { PolicyBudget } from './PolicyBudget';
import { CourierManagementClean } from './CourierManagementClean';
import { Users, Wallet, Shield, TrendingUp, Package } from 'lucide-react';

export function ManageConsolidated() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manage</h1>
        <p className="text-sm text-gray-600 mt-1">Employees, Wallets, Policies, Budgets & Courier Services - All in one place</p>
      </div>

      {/* Tabbed Content */}
      <Tabs defaultValue="employees" className="space-y-6">
        <TabsList className="bg-white border shadow-sm">
          <TabsTrigger value="employees" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
            <Users className="w-4 h-4 mr-2" />
            Employees
          </TabsTrigger>
          <TabsTrigger value="wallets" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
            <Wallet className="w-4 h-4 mr-2" />
            Wallets
          </TabsTrigger>
          <TabsTrigger value="policies" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
            <Shield className="w-4 h-4 mr-2" />
            Policies & Budget
          </TabsTrigger>
          <TabsTrigger value="courier" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
            <Package className="w-4 h-4 mr-2" />
            Courier Services
          </TabsTrigger>
        </TabsList>

        <TabsContent value="wallets">
          <WalletManagementAdmin />
        </TabsContent>

        <TabsContent value="policies">
          <PolicyBudget />
        </TabsContent>

        <TabsContent value="courier">
          <CourierManagementClean />
        </TabsContent>
      </Tabs>
    </div>
  );
}
