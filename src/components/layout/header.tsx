"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, UserCircle, Menu, LogOut } from "lucide-react";
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import logo from "../../../public/USMMarketplace4ULogo.png";


const navLinks = [
  { href: "/", label: "Home" },
];

export function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut, loading } = useAuth();

  // Debug: Log user state
  console.log('Header - User:', user);
  console.log('Header - Loading:', loading);

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center px-4 md:px-6">
        <Link href="/" className="mr-6 flex items-center gap-2">
          <Image src={logo} alt="USM Marketplace4U Logo" width={32} height={32} className="rounded-md" />
          <span className="font-headline text-lg font-bold">USM Marketplace4U</span>
        </Link>
        
        {!pathname.startsWith('/admin') && (
          <div className="relative hidden flex-1 md:flex">
            <form onSubmit={handleSearch} className="w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search for products..."
                className="w-full max-w-sm pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>
          )}

        <nav className="hidden items-center gap-4 md:flex ml-auto">
          {navLinks.map((link) => (
            <Button
              key={link.href}
              variant="ghost"
              asChild
              className={pathname === link.href ? "text-primary" : ""}
            >
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
          {user && user.role === "seller" && (
            <Button variant="ghost" asChild className={pathname === '/my-products' ? "text-primary" : ""}>
              <Link href="/my-products">My Products</Link>
            </Button>
          )}
          {user && user.role === "admin" && (
             <Button variant="ghost" asChild className={pathname === '/admin' ? "text-primary" : ""}>
               <Link href="/admin">Admin</Link>
             </Button>
          )}
        </nav>

        <div className="ml-4 flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <UserCircle className="h-8 w-8" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground capitalize">
                      {user.role}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Button variant="outline" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Register</Link>
              </Button>
            </div>
          )}
        </div>

        <div className="ml-auto md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="mt-8 grid gap-6 text-lg font-medium">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-4 px-2.5 ${
                      pathname === link.href
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                {user && user.role === "seller" && (
                  <Link
                    href="/my-products"
                    className={`flex items-center gap-4 px-2.5 ${
                      pathname === '/my-products'
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    My Products
                  </Link>
                )}
                {user && user.role === 'admin' && (
                  <Link
                    href="/admin"
                    className={`flex items-center gap-4 px-2.5 ${
                      pathname === '/admin'
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Admin
                  </Link>
                )}
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-4 px-2.5 text-red-600 hover:text-red-700"
                  >
                    <LogOut className="h-5 w-5" />
                    Logout
                  </button>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    >
                      Register
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
