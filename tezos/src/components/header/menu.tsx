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

export default function Menu() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

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

    if (!mounted) {
        return null;
    }


    return (
        <>
            <div className="flex p-4 bg-black justify-between items-center">
                <Image src={"/image(1).webp"} alt={"Logo"} width={200} height={50}/>
                <NavigationMenu>
                    <NavigationMenuList className="flex gap-4 items-center">
                        <NavigationMenuItem>
                            <NavigationMenuLink className="text-white hover:text-gray-300">Features</NavigationMenuLink>

                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link href="/how-it-works" legacyBehavior passHref>
                                <NavigationMenuLink className="text-white hover:text-gray-300">
                                    How it Works
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
                <NavigationMenu>
                    <NavigationMenuList className="flex gap-4 items-center">
                    <NavigationMenuItem>
                            <Link href="/sign-in" legacyBehavior passHref>
                                <NavigationMenuLink className="text-white hover:text-gray-300">
                                    Sign In
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleTheme}
                        >
                            {theme === "dark" ? (
                                <>
                                    <Icon icon="solar:sun-bold" width="24" height="24"  />

                                </>
                            ) : (
                                <>
                                    <Icon icon="line-md:moon-filled" width="24" height="24" />

                                </>
                            )}
                        </Button>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>
        </>
    );
}