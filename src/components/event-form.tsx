"use client";

import { useState, useEffect } from "react";
import { FriendsApiService } from "@/components/server-api-serivces/friends-api-service"
import { EventApiService } from "@/components/server-api-serivces/event-api-service"
import { UserApiService } from "@/components/server-api-serivces/user-api-service"
import { useRouter, useParams } from "next/navigation";
import SearchDropdown from "@/components/search-dropdown"
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'

interface EventForm {
    title: string;
    isCreatingEvent: boolean;
    eventName?: string | undefined;
    eventDate?: Date | undefined;
    participants?: Record<number, [string, string]> | undefined;
    activeParticipants?: number[] | undefined;
}

export default function EventForm(eventFormData: EventForm) {
    const { fetchFriends } = FriendsApiService();
    const { fetchUser } = UserApiService();
    const { createEvent, updateEvent } = EventApiService();
    const router = useRouter();
    const params = useParams();

    const [availableFriends, setAvailableFriends] = useState<Record<number, [string, string]>>([]);
    const [participants, setParticipants] = useState<Record<number, [string, string]>>([]);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(eventFormData.isCreatingEvent ? new Date() : eventFormData.eventDate);
    const [isOpen, setIsOpen] = useState(false);
    const [eventName, setEventName] = useState(eventFormData.isCreatingEvent ? "" : eventFormData.eventName);

    // Error messages
    const [showNameErrorMessage, setShowNameErrorMessage] = useState(false);
    const [showDateErrorMessage, setShowDateErrorMessage] = useState(false);
    const [showRequestErrorMessage, setShowRequestErrorMessage] = useState(false);
    const [requestErrorMessage, setRequestErrorMessage] = useState("");

    const addParticipant = (friend: [number, [string, string]]) =>  {
        console.log("Adding participant: ", friend);
        setParticipants(prev => ({
            ...prev,
            [friend[0]]: friend[1]
        }));
        setAvailableFriends(prev => {
            const { [friend[0]]: _, ...rest } = prev;
            return rest;
        });
    }

    const removeParticipant = (participant: [number, [string, string]]) =>  {
        console.log("Removing participant: ", participant);
        setAvailableFriends(prev => ({
            ...prev,
            [participant[0]]: participant[1]
        }));
        setParticipants(prev => {
            const { [participant[0]]: _, ...rest } = prev;
            return rest;
        });
    }

    useEffect(() => {
        const getFriends = async () => {
            const userFriendsData = await fetchFriends()

            if (!userFriendsData.actionSuccess) {
                alert(userFriendsData.errorMessage);
                return;
            }

            if (!eventFormData.isCreatingEvent) {
                const userData = await fetchUser()

                if (!userData.actionSuccess) {
                    alert(userData.errorMessage);
                    return;
                }
                
                const ep: Record<number, [string, string]> = Object.fromEntries(
                    Object.entries(eventFormData.participants as Record<number, [string, string]>).filter(([key]) => Number(key) !== userData.userId)
                ) as Record<number, [string, string]>;
                setParticipants(ep);
                setAvailableFriends(Object.fromEntries(
                Object.entries(userFriendsData.friends as Record<number, [string, string]>).filter(
                        ([key]) => !(Number(key) in ep)
                    )
                ) as Record<number, [string, string]>)
            }
            else {
                setAvailableFriends(userFriendsData.friends as Record<number, [string, string]>);
            }
        }
        
        console.log("useEffect ran")
        getFriends();

        }, [fetchFriends, fetchUser, eventFormData.isCreatingEvent, eventFormData.participants]);

    const handleCreateEvent = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // prevent full page reload

        const participantIds = Object.keys(participants).map(id => Number(id));

        let errorsExist = false;

        // Validate fields
        if (!eventName || eventName?.trim().length === 0) {
            setShowNameErrorMessage(true);
            errorsExist = true;
        }
        else
            setShowNameErrorMessage(false);
        if (selectedDate == undefined) {
            setShowDateErrorMessage(true)
            errorsExist = true;
        }
        else
            setShowDateErrorMessage(false)
        if (errorsExist)
            return;

        let data = null;
        let eId = Number(params.eventId as string);

        if (eventFormData.isCreatingEvent) {
            data = await createEvent({ eventName: eventName as string, eventDate: selectedDate as Date, participants: participantIds });
            eId = data.eventId as number;
        }
        else {
            data = await updateEvent({ eventId: Number(params.eventId as string), eventName: eventName as string, eventDate: selectedDate as Date, participants: participantIds });
        }

        if (data.actionSuccess)
            router.push(`/event/${eId}`);
        else {
            setRequestErrorMessage(data.errorMessage!);
            setShowRequestErrorMessage(true);
        }
    };

    return (
        <div className="pageSection flex text-1xl md:text-2xl">
            <form
                onSubmit={handleCreateEvent}
                className=" self-center grid grid-cols-1 md:grid-cols-[auto_1fr] bg-[var(--color-bg-accent)] place-items-center rounded-lg p-10 mx-auto w-[90dvw] md:w-[50dvw] h-max gap-3 md:gap-6">
                {/* Title */}
                <h1 className="text-3xl md:text-4xl md:col-span-2">{eventFormData.title}</h1>

                {/* Event Name */}
                <div className="flex place-items-center h-max md:h-full w-full">
                    <label htmlFor="create-event-event-name">
                        Event Name:
                    </label>
                </div>
                <input 
                    type="text" 
                    id="create-event-event-name" 
                    name="event-name" 
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    className="p-3 bg-[var(--color-background)] rounded-lg w-full md:col-span-1"/>
                {
                    showNameErrorMessage &&
                    <div className="text-[var(--color-bad)] text-sm md:text-lg md:col-span-2">
                        Event name cannot be empty.
                    </div>
                }

                {/* Event Date */}
                <div className="flex place-items-center h-max md:h-full w-full">
                    <label htmlFor="create-event-event-name">
                        Event Date:
                    </label>
                </div>
                <button
                    type="button"
                    className="bg-[var(--color-background)] hover:bg-[var(--color-bg-alt-accent)] text-[var(--color-foreground)] rounded-lg p-3 w-full h-full"
                    onClick={() => setIsOpen(true)}>
                   {selectedDate != undefined ? selectedDate.toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                    }) : "Select a date"} 
                </button>
                {
                    showDateErrorMessage &&
                    <div className="text-[var(--color-bad)] text-sm md:text-lg md:col-span-2">
                        Event date cannot be empty.
                    </div>
                }

                {/* Add item dialog */}
                <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
                    <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-black/50">
                    <DialogPanel className="max-w-[80dvh] w-max space-y-4 bg-[var(--color-bg-accent)] rounded-lg p-5 md:p-12">
                        <DialogTitle className="font-bold text-center text-3xl md:text-4x1">Select Event Date</DialogTitle>
                        <DayPicker 
                            className="rdp-root"
                            mode="single" 
                            selected={selectedDate} 
                            modifiersStyles={{
                                selected: {
                                    backgroundColor: 'var(--color-bg-accent)',
                                    color: 'var(--color-foreground)',
                                },
                                today: {
                                    backgroundColor: 'var(--color-bg-accent)',
                                    color: 'var(--color-foreground)', 
                                },
                            }}
                            onSelect={(date) => {
                                setIsOpen(false);
                                setSelectedDate(date);
                            }}/>
                    </DialogPanel>
                    </div>
                </Dialog>

                {/* Participants Search */}
                <div className="h-max md:h-full md:col-span-2 flex place-items-center w-full">
                    <span>
                        Participants:
                    </span>
                </div>
                <div className="md:col-span-2 w-full">
                    <SearchDropdown
                        placeholder="Search friends..."
                        data={availableFriends}
                        onSelect={(id, value) => addParticipant([Number(id), value])}
                        displayFn={(value) => `${value[0]} | ${value[1]}`}
                    />
                </div>

                {/* Selected participants */}
                <ul 
                    id="create-event-participants-list"
                    className="md:col-span-2 grid grid-cols-1 gap-2 w-full rounded-lg p-3 bg-[var(--color-background)] max-h-[20dvh] h-[20dvh] overflow-y-auto content-start">
                    {participants && Object.entries(participants)
                        .sort((a, b) => a[1][0].localeCompare(b[1][0]))
                        .map(p => (
                        <li key={p[0]} className="rounded-lg bg-[var(--color-bg-alt-accent)] text-[var(--color-fg-accent)] px-3 py-1 rounded items-center gap-1 grid grid-cols-[1fr_auto] h-max">
                            <div>
                                <span className="truncate w-[50dvw] md:w-[40dvw] inline-block">{p[1][0]} | {p[1][1]}</span>
                            </div>
                            <button 
                                type="button"
                                onClick={() => {
                                    console.log(`Trying to remove user ${Number(p[0])}`);
                                    console.log(eventFormData.activeParticipants)
                                    if (eventFormData.activeParticipants?.includes(Number(p[0])))
                                        alert("Participant must be removed from all activity items first.")
                                    else
                                        removeParticipant([Number(p[0]), p[1]]);
                                }} className="bg-[var(--color-bad)] rounded-lg p-1 hover:bg-[var(--color-bad-accent)] w-max justify-self-end aspect-square md:text-1xl">
                                ✖
                            </button>
                        </li>
                    ))}
                </ul>
                
                <div
                    className="grid grid-cols-2 gap-4 md:col-span-2 w-full">
                    {/* Cancel button */}
                    <button
                        type="button"
                        onClick={() => router.push(`/event/${params.eventId}`)}
                        className="bg-[var(--color-bad)] hover:bg-[var(--color-bad-accent)] text-[var(--color-foreground)] rounded-lg p-3 w-full">
                        Cancel
                    </button>
                    {/* Submit/Edit Button */}
                    <button
                        type="submit"
                        className="bg-[var(--color-good)] hover:bg-[var(--color-good-accent)] text-[var(--color-foreground)] rounded-lg p-3 w-full">
                        {eventFormData.isCreatingEvent ? "Create" : "Save"}
                    </button>
                </div>
                {
                    showRequestErrorMessage &&
                    <div className="text-[var(--color-bad)] text-sm md:text-lg md:col-span-2 text-wrap">
                        {requestErrorMessage}
                    </div>
                }
            </form>
        </div>
    );
}