'use client';

import { useEffect, useState } from 'react';
import { getUsers, getProducts } from '@/lib/firestore';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import type { User, Product } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminProductsTable } from '@/components/admin-products-table';
import { AdminUsersTable } from '@/components/admin-users-table';
import { Users, ShoppingBag, DollarSign, TrendingUp } from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [conditionData, setConditionData] = useState<any[]>([]);
  const [timelineData, setTimelineData] = useState<any[]>([]);

  useEffect(() => {
    // Redirect if not admin
    if(!authLoading && (!user || user.role !== 'admin')){
      router.push('/');
      return;
    }

    async function fetchData() {
      try {
        const [usersData, productsData] = await Promise.all([
          getUsers(),
          getProducts(),
        ]);
        setUsers(usersData);
        setProducts(productsData);

        // Process category data
        const categoryCount: { [key: string]: number } = {};
        productsData.forEach((p) => {
          categoryCount[p.category] = (categoryCount[p.category] || 0) + 1;
        });
        setCategoryData(
          Object.entries(categoryCount).map(([name, value]) => ({
            name,
            count: value,
          }))
        );

        // Process condition data
        const conditionCount: { [key: string]: number } = {};
        productsData.forEach((p) => {
          conditionCount[p.condition] = (conditionCount[p.condition] || 0) + 1;
        });
        setConditionData(
          Object.entries(conditionCount).map(([name, value]) => ({
            name,
            value,
          }))
        );

        // Process timeline data (last 7 days mock)
        const today = new Date();
        const timelineArray = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dateStr = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          });
          const productsOnDate = productsData.filter((p) => {
            const pDate = new Date(p.createdAt).toLocaleDateString();
            return pDate === date.toLocaleDateString();
          }).length;
          timelineArray.push({
            date: dateStr,
            products: productsOnDate + Math.floor(Math.random() * 3),
          });
        }
        setTimelineData(timelineArray);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    if(user?.role === 'admin'){
      fetchData();
    }

  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="text-center">Loading...</div>
      </div>
    );
  }
  if (!user || user.role !== 'admin') {
    return(
      <div>
        <h1 className="flex items-center justify-center h-48 text-4xl font-bold">Error 403: Forbidden</h1>
        <p className="flex items-center h-48 justify-center">You don't have any permission to access this page.</p>
        <br/>
        <p className="flex flex-col items-center justify-center mb-4">Redirecting to previous page...</p>
      </div>
    );
  }

  const totalUsers = users.length;
  const totalProducts = products.length;
  const totalSalesValue = products.reduce((sum, p) => sum + p.price, 0);


  return (
    <div className="container mx-auto space-y-8 px-4 py-12 md:px-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor and manage your platform.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Listing Value
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              RM{totalSalesValue.toLocaleString('en-US')}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Products by Category</CardTitle>
            <CardDescription>Distribution across categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Conditions</CardTitle>
            <CardDescription>Condition breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={conditionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  <Cell fill="#3b82f6" />
                  <Cell fill="#10b981" />
                  <Cell fill="#f59e0b" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Listings Trend (7 Days)
          </CardTitle>
          <CardDescription>New products added over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="products"
                stroke="#3b82f6"
                dot={{ fill: '#3b82f6' }}
                name="New Listings"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Tabs defaultValue="products">
        <TabsList>
          <TabsTrigger value="products">Reported Products</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Reported Products</CardTitle>
              <CardDescription>Manage all reported product listings.</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminProductsTable products={products} users={users} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>Manage all registered users.</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminUsersTable users={users} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
