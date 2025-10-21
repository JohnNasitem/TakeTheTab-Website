"use client";

import { useEffect } from "react";
import { useRouter, useParams  } from "next/navigation";

export default function FetchEventPage() {
    const router = useRouter();
    const params = useParams();

    useEffect(() => {
        router.push("/event/" + params.eventId);
        });

    return (<></>);
}