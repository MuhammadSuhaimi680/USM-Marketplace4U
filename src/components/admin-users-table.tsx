'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { User } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AdminUsersTableProps {
  users: User[];
}

export function AdminUsersTable({ users }: AdminUsersTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow> 
          <TableHead>User</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Listings</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead>
            { /* <span className="sr-only">Actions</span> */ } 
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={user.avatarUrl} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="font-medium">{user.name}</div>
              </div>
            </TableCell>
            <TableCell>
              <Badge
                variant={user.role === 'admin' ? 'default' : 'secondary'}
              >
                {user.role}
              </Badge>
            </TableCell>
            <TableCell>{user.listingsCount}</TableCell>
            <TableCell>
              {new Date(user.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button aria-haspopup="true" size="icon" variant="ghost">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
                  <DropdownMenuItem>View Profile</DropdownMenuItem>
                  <DropdownMenuItem>Suspend User</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
