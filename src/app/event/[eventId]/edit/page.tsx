"use client";

import EventForm from "@/components/event-form";
import { EventApiService } from "@/components/server-api-serivces/event-api-service"
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { FetchEventResponse } from "@/interfaces/server-responses";

export default function CreateEventPage() {
    const router = useRouter();
    const params = useParams();
    const { fetchEvent } = EventApiService();

    const [event, setEvent] = useState<FetchEventResponse | null>(null);

    useEffect(() => {
        const getEvent = async () => {
            console.log("Fetching event with id: ", params.eventId);
            
            if (isNaN(Number(params.eventId))) {
                alert("Invalid event id");
                router.push("/");
                return;
            }

            setEvent(await fetchEvent(Number(params.eventId)));
        }
        
        console.log("Edit useEffect ran");
        getEvent();
    }, [fetchEvent, params.eventId, router])

    return (
        event &&
        <EventForm 
            title="Edit Event"
            isCreatingEvent={false}
            eventName={event?.eventName ?? "Error"}
            eventDate={event?.eventDate ? new Date(event!.eventDate) : new Date()}
            participants={event?.participants?.reduce(
                (acc, participant) => {
                    acc[participant.userId] = [participant.displayName, participant.email];
                    return acc;
                },
                {} as Record<number, [string, string]>
            )}
            activeParticipants={event?.activeParticipants as number[]}
        />
    );
}