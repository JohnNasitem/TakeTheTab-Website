"use client";

import { useEffect } from "react";
import { useRouter  } from "next/navigation";

export default function FetchEventPage() {
    const router = useRouter();

    useEffect(() => {
        router.push("/");
        });

    return (<></>);
}