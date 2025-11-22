'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/use-auth';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function ReportsPage() {
  const { user, loading: authLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && user?.role !== 'admin') {
      return;
    }

    async function fetchReports() {
      try {
        const response = await fetch('/api/reports');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch reports.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      fetchReports();
    }
  }, [authLoading, user?.role, toast]);

  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="text-center">
          <p className="text-lg font-semibold">Access Denied</p>
          <p className="mt-2 text-muted-foreground">Only admins can view reports.</p>
        </div>
      </div>
    );
  }

  const handleApproveReport = async (productId: string, reportId: string) => {
    try {
      const response = await fetch('/api/reports', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          reportId,
          action: 'approve',
        }),
      });

      if (response.ok) {
        toast({
          title: 'Report approved',
          description: 'Product has been deleted.',
        });
        setProducts((prev) => prev.filter((p) => p.id !== productId));
      } else {
        toast({
          title: 'Error',
          description: 'Failed to approve report.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error approving report:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve report.',
        variant: 'destructive',
      });
    }
  };

  const handleRejectReport = async (productId: string, reportId: string) => {
    try {
      const response = await fetch('/api/reports', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          reportId,
          action: 'reject',
        }),
      });

      if (response.ok) {
        toast({
          title: 'Report rejected',
          description: 'Report status has been updated.',
        });
        // Refresh reports
        const reportsResponse = await fetch('/api/reports');
        if (reportsResponse.ok) {
          const data = await reportsResponse.json();
          setProducts(data);
        }
      } else {
        toast({
          title: 'Error',
          description: 'Failed to reject report.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error rejecting report:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject report.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <Card>
        <CardHeader>
          <CardTitle>Product Reports</CardTitle>
          <CardDescription>
            Review and manage product reports from users.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {products.length > 0 ? (
            <div className="space-y-8">
              {products.map((product) => (
                <div key={product.id} className="border rounded-lg p-4">
                  <div className="flex gap-4 mb-4">
                    <Image
                      alt="Product image"
                      className="rounded-md object-cover"
                      height="100"
                      src={product.imageUrl}
                      width="100"
                      data-ai-hint={product.imageHint}
                    />
                    <div>
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        RM{product.price.toFixed(2)} • {product.category}
                      </p>
                      <p className="text-sm mt-2">{product.description}</p>
                    </div>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Report Reason</TableHead>
                        <TableHead>Reported By</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {product.reports?.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell>{report.reason}</TableCell>
                          <TableCell>{report.reportedBy}</TableCell>
                          <TableCell>
                            {new Date(report.reportedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                report.status === 'pending'
                                  ? 'default'
                                  : report.status === 'approved'
                                  ? 'destructive'
                                  : 'secondary'
                              }
                            >
                              {report.status || 'pending'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {report.status === 'pending' && (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleApproveReport(product.id, report.id)
                                  }
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    handleRejectReport(product.id, report.id)
                                  }
                                >
                                  Reject
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No reports yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
