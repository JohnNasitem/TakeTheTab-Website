"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from "next/navigation";

type NarbarProps = {
    links: { name: string; href: string }[];    // Array of objects with name and href properties
    logo?: string;   // Optional logo URL
}

const Navbar: React.FC<NarbarProps> = ({ links, logo}) => {
    const pathname = usePathname();
    const hideNavbar = ["/login", "/signup"].includes(pathname);

    if (hideNavbar) return null;

    return (
        <nav className="sticky top-0 bg-[var(--color-bg-alt-accent)] p-3 z-1000 text-2xl">
            <div className="container mx-auto flex justify-between items-center">
                {/* Only add logo if one is supplied */}
                {logo && (
                    <Link href ="/" className="flex items-center">
                        <Image width={100} height={100} src={logo} alt="Logo" className="h-8 w-auto" />
                    </Link>
                )}

                {/* Desktop Links */}
                <div className="hidden md:flex space-x-6">
                    {links.map((link, index) => (
                        <Link key={index} href={link.href} className="text-[var(--color-foreground)] hover:text-[var(--color-background)]">{link.name}</Link>
                    ))}
                </div>

                {/* Mobile Menu */}
                <div className={`md:hidden bg-[var(--color-bg-alt-accent)] flex space-x-6`}>
                        {links.map((link, index) => (
                            <Link key={index} href={link.href} className="block text-[var(--color-foreground)] py-2 hover:text-[var(--color-background)]">{link.name}</Link>
                        ))}
                    </div>
            </div>
        </nav>
    );
};

export default Navbar;
