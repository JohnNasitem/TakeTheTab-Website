import { useCallback } from "react";
import { sendApiCall } from "@/components/server-api-serivces/api-util";
import { FetchEventResponse, GenericResponse, CreateEventResponse } from "@/interfaces/server-responses";

const serverPath = "https://api.takethetab.com/events";

interface CreateEventType {
    eventName: string;
    eventDate: Date;
    participants: number[];
}

interface UpdateEventType {
    eventId: number;
    eventName: string;
    eventDate: Date;
    participants: number[];
}

export const EventApiService = () => {
    const createEvent = useCallback(async (createEventData: CreateEventType): Promise<CreateEventResponse> => {
        return await sendApiCall<CreateEventResponse>(`${serverPath}`, "POST", JSON.stringify({ 
            EventName: createEventData.eventName, 
            EventDate: createEventData.eventDate.toISOString(),
            Participants: createEventData.participants
        }));
    }, []);

    const fetchEvent = useCallback(async (eventId: number): Promise<FetchEventResponse> => {
        return await sendApiCall<FetchEventResponse>(`${serverPath}/${eventId}`, "GET");
    }, []);

    const updateEvent = useCallback(async (updateEventData: UpdateEventType): Promise<GenericResponse> => {
        return await sendApiCall<GenericResponse>(`${serverPath}/${updateEventData.eventId}`, "PUT", JSON.stringify({ 
            EventName: updateEventData.eventName,
            EventDate: updateEventData.eventDate,
            Participants: updateEventData.participants
        }));
    }, []);

    const deleteEvent = useCallback(async (eventId: number): Promise<GenericResponse> => {
        return await sendApiCall<GenericResponse>(`${serverPath}/${eventId}`, "DELETE");
    }, []);

    return { createEvent, fetchEvent, updateEvent, deleteEvent };
}