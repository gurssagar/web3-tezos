'use client'

import Image from "next/image";
import { useTheme } from "next-themes";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icon } from '@iconify/react';
import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import type { Session } from "next-auth";

export default function Menu() {
    const [mounted, setMounted] = useState<boolean>(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
    const { theme, setTheme } = useTheme();
    const { data: session } = useSession() as { data: Session | null };

    useEffect(() => {
        setMounted(true);
        const storedTheme = localStorage.getItem('theme') || 'light';
        setTheme(storedTheme);
    }, [setTheme]);

    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    if (!mounted) {
        return null;
    }

    return (
        <>
            <div className="flex p-4 bg-black justify-between items-center">
                <Image src={"/image(1).webp"} alt={"Logo"} width={200} height={50}/>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center">
                    <NavigationMenu className={'px-4'}>
                        <NavigationMenuList className="flex gap-4 items-center">
                            <NavigationMenuItem>
                                <NavigationMenuLink href="#features" className="text-white hover:text-gray-300">
                                    Features
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <Link href="#how" legacyBehavior passHref>
                                    <NavigationMenuLink className="text-white  hover:text-gray-300">
                                        How it Works
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <Link href="/menu" legacyBehavior passHref>
                                    <NavigationMenuLink className="text-white hover:text-gray-300">
                                        Menu
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                            {session && (
                                <NavigationMenuItem>
                                    <Link href="/Dashboard" legacyBehavior passHref>
                                        <NavigationMenuLink className="text-white hover:text-gray-300">
                                            Dashboard
                                        </NavigationMenuLink>
                                    </Link>
                                </NavigationMenuItem>
                            )}
                        </NavigationMenuList>
                    </NavigationMenu>
                    <NavigationMenu>
                        <NavigationMenuList className="flex gap-4 items-center">
                            {session ? (
                                <>
                                    <NavigationMenuItem>
                                        <Image
                                            src={session.user?.image || ""}
                                            alt={session.user?.name || "User"}
                                            width={32}
                                            height={32}
                                            className="rounded-full"
                                        />
                                    </NavigationMenuItem>
                                    <NavigationMenuItem>
                                        <span className="text-white">{session.user?.name}</span>
                                    </NavigationMenuItem>
                                    <NavigationMenuItem>
                                        <Button className={`bg-white`} onClick={() => signOut()}>
                                            <NavigationMenuLink className="text-black  hover:text-gray-900">
                                                Sign Out
                                            </NavigationMenuLink>
                                        </Button>
                                    </NavigationMenuItem>
                                </>
                            ) : (
                                <NavigationMenuItem>
                                    <Button className={`bg-white`} onClick={() => signIn("github")}>
                                        <NavigationMenuLink className="text-black  hover:text-gray-900">
                                            Sign In
                                        </NavigationMenuLink>
                                    </Button>
                                </NavigationMenuItem>
                            )}
                            <Button
                                size="icon"
                                onClick={toggleTheme}
                            >
                                {theme === "dark" ? (
                                    <Icon icon="solar:sun-bold" width="24" height="24" />
                                ) : (
                                    <Icon icon="line-md:moon-twotone" width="24" height="24"  style={{color: `white`}} />
                                )}
                            </Button>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleMobileMenu}
                    >
                        <Icon icon={mobileMenuOpen ? "mdi:close" : "mdi:menu"} width="24" height="24" />
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden fixed  pt-10 top-0 left-0 w-64 h-full bg-black p-4 z-50 transform transition-transform duration-300 ease-in-out" style={{ transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)' }}>
                    <NavigationMenu>
                        <NavigationMenuList className="block flex-col space-y-2">
                            <NavigationMenuItem>
                                <NavigationMenuLink href="#features" className="text-left text-white hover:text-gray-300">Features</NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <Link href="#how" legacyBehavior passHref>
                                    <NavigationMenuLink className="text-white text-left hover:text-gray-300">
                                        How it Works
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <Link href="/menu" legacyBehavior passHref>
                                    <NavigationMenuLink className="text-white text-left hover:text-gray-300">
                                        Menu
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                            {session && (
                                <NavigationMenuItem>
                                    <Link href="/dashboard" legacyBehavior passHref>
                                        <NavigationMenuLink className="text-white text-left hover:text-gray-300">
                                            Dashboard
                                        </NavigationMenuLink>
                                    </Link>
                                </NavigationMenuItem>
                            )}
                            {session ? (
                                <>
                                    <NavigationMenuItem>
                                        <Button onClick={() => signOut()} className="w-full">
                                            <NavigationMenuLink className="text-black text-left hover:text-gray-900">
                                                Sign Out
                                            </NavigationMenuLink>
                                        </Button>
                                    </NavigationMenuItem>
                                    <NavigationMenuItem>
                                        <div className="flex items-center">
                                            <Image
                                                src={session.user?.image || ""}
                                                alt={session.user?.name || "User"}
                                                width={32}
                                                height={32}
                                                className="rounded-full"
                                            />
                                            <span className="ml-2 text-white">{session.user?.name}</span>
                                        </div>
                                    </NavigationMenuItem>
                                </>
                            ) : (
                                <NavigationMenuItem>
                                    <Button onClick={() => signIn("github")} className="w-full">
                                        <NavigationMenuLink className="text-black text-left hover:text-gray-900">
                                            Sign In
                                        </NavigationMenuLink>
                                    </Button>
                                </NavigationMenuItem>
                            )}
                            <NavigationMenuItem>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={toggleTheme}
                                    className="w-full flex justify-start"
                                >
                                    {theme === "dark" ? (
                                        <Icon icon="solar:sun-bold" width="24" height="24" />
                                    ) : (
                                        <Icon icon="line-md:moon-filled" width="24" height="24" />
                                    )}
                                    <span className="ml-2">Toggle Theme</span>
                                </Button>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
            )}
        </>
    );
}
