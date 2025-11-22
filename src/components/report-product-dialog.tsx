'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Flag } from 'lucide-react';

interface ReportProductDialogProps {
  productId: string;
  productName: string;
  userId: string | null;
}

export function ReportProductDialog({
  productId,
  productName,
  userId,
}: ReportProductDialogProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!userId) {
      toast({
        title: 'Please log in',
        description: 'You must be logged in to report a product.',
        variant: 'destructive',
      });
      return;
    }

    if (!reason.trim()) {
      toast({
        title: 'Reason required',
        description: 'Please provide a reason for reporting this product.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/products/${productId}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reason,
          reportedBy: userId,
        }),
      });

      if (response.ok) {
        toast({
          title: 'Report submitted',
          description: 'Thank you for reporting this product. Our team will review it.',
        });
        setReason('');
        setOpen(false);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to submit report.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit report.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full text-destructive hover:text-destructive">
          <Flag className="mr-2 h-4 w-4" />
          Report This Product
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report Product</DialogTitle>
          <DialogDescription>
            Report "{productName}" for violating community guidelines or other concerns.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="Please describe why you're reporting this product..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="min-h-32"
          />
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
