"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from "next/navigation";
import { HomeIcon, UserIcon, UserGroupIcon } from '@heroicons/react/20/solid'

function Navbar() {
    const navbarLinks = [
        { icon: HomeIcon, href: "/" },
        { icon: UserIcon, href: "/account" },
        { icon: UserGroupIcon, href: "/friends" }
    ]
    const logo = "/icon.svg";

    const pathname = usePathname();
    const hideNavbar = ["/login", "/signup"].includes(pathname);

    if (hideNavbar) return null;

    return (
        <nav className="sticky top-0 bg-[var(--color-bg-alt-accent)] p-1 z-1000 text-2xl w-full">
            <div className="grid grid-cols-[1fr_auto] w-full">
                {/* Only add logo if one is supplied */}
                {logo && (
                    <Link href ="/" className="flex items-start pl-5 md:pl-10">
                        <Image width={100} height={100} src={logo} alt="Logo" className="h-10 w-10 md:h-20 md:w-20" />
                    </Link>
                )}

                {/* Desktop Links */}
                <div className="hidden md:flex space-x-6 items-center pr-10">
                    {navbarLinks.map(({ icon: Icon, href }, index) => (
                        <Link key={index} href={href} className="text-[var(--color-foreground)] hover:text-[var(--color-background)]"><Icon className='w-10 h-10'/></Link>
                    ))}
                </div>

                {/* Mobile Menu */}
                <div className={`md:hidden bg-[var(--color-bg-alt-accent)] flex space-x-6 items-center pr-5 md:pr-10`}>
                    {navbarLinks.map(({ icon: Icon, href }, index) => (
                        <Link key={index} href={href} className="block text-[var(--color-foreground)] py-2 hover:text-[var(--color-background)]"><Icon className='w-8 h-8'/></Link>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
