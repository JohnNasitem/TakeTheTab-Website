"use client";

import { useState, useEffect } from "react";
import { EventApiService } from "@/components/server-api-serivces/event-api-service"
import { UserApiService } from "@/components/server-api-serivces/user-api-service"
import { useRouter, useParams  } from "next/navigation";
import { ItemProps } from "@/components/list-item";
import List from "@/components/list";
import { FetchEventResponse, FetchEventResponseActivity, FetchEventResponseParticipant} from '@/interfaces/server-responses'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { ChevronDownIcon, PencilSquareIcon } from '@heroicons/react/20/solid'

interface ParticipantItem {
    participantData: FetchEventResponseParticipant;
    onRemove: () => void;
    clickLink: string;
}

export default function FetchEventPage() {
    const { fetchEvent } = EventApiService();
    const { fetchUser } = UserApiService();
    const router = useRouter();
    const params = useParams();
    
    const [event, setEvent] = useState<FetchEventResponse>();
    const [activities, setActivities] = useState<ItemProps[]>([]);
    const [eventDate, setEventDate] = useState<Date | null>(null);

    // Participant list
    const [canModify, setCanModify] = useState(false);
    const [participants, setParticipants] = useState<ParticipantItem[]>([]) 

    useEffect(() => {
        const getEvent = async () => {
            console.log("Fetching event with id: ", params.eventId);
            
            if (isNaN(Number(params.eventId))) {
                alert("Invalid event id");
                router.push("/");
                return;
            }

            const eventData = await fetchEvent(Number(params.eventId));
            const userData = await fetchUser();

            if (!eventData.actionSuccess || !userData.actionSuccess) {
                alert(eventData.errorMessage ?? userData.errorMessage);
                router.push("/");
                return;
            }

            setEvent(eventData);
            setEventDate(eventData.eventDate ? new Date(eventData.eventDate) : null);
            setCanModify(eventData.createdEvent as boolean);
            setParticipants((eventData.participants as FetchEventResponseParticipant[])
                .filter(participant => participant.userId != userData.userId)
                .map(
                (participant) => ({
                    clickLink: `/friends/${participant.userId}`,
                    participantData: participant,
                    onRemove: () => {
                        // TODO: Check if the participant is in any activities, if not then remove, otherwise alert user they cannot remove this participant
                        alert("test");
                    }
                })
            ));
            setActivities(Object.entries(eventData.activities as Record<number, FetchEventResponseActivity>).map(
                ([activityId, activityDetails]) => ({
                    id: Number(activityId),
                    name: activityDetails.activityName,
                    totalOwed: activityDetails.owedMoney ? activityDetails.amount : 0,
                    totalOwing: activityDetails.owedMoney ? 0 : activityDetails.amount,
                    clickLink: `/event/${params.eventId}/activity/${activityId}`,
                    showTotal: true
                })
            ));
        }
    
        getEvent();
        }, [params.eventId, fetchEvent, fetchUser, router]);

        const ConfirmParticipantPayment = () => {
            // TODO: FINISH
        }

        const RemindUserToPay = () => {
            // TODO: FINISH
        }

        const RequestPaymentConfirmation = () => {

        }

        const PayBackUser = (creditorId: number) => {

        }

    return (
        // Entire Page
        <div className="pageSection p-3 grid grid-rows-[auto_auto_1fr] md:grid-rows-[auto_1fr] grid-cols-2 md:grid-cols-[66fr_17fr_17fr] gap-4">

            {/* Event name and date */}
            <div className="col-span-2 md:col-span-1 grid grid-col-1 md:grid-cols-[auto_1fr] w-full gap-4 grid-rows-[1fr_auto] md:grid-rows-1 bg-[var(--color-bg-accent)] rounded-3xl p-5">
                <div className="text-3xl md:text-7xl md:max-w-max grid w-full md:grid-cols-1 grid-cols-[1fr_auto] md:grid-rows-1 gap-2">
                    <h1 className="md:flex md:items-end h-full font-bold w-full truncate w-full max-w-[100%] inline-block">
                        {event?.eventName ?? ""} 
                    </h1>
                    {
                        canModify &&
                        <div
                            className="flex justify-end md:justify-start md:hidden">
                            <button
                                type="button"
                                className="w-10 h-10"
                                onClick={() => router.push(`${params.eventId}/edit`)}>
                                <PencilSquareIcon className="stroke-[var(--color-foreground)] group-hover:stroke-[var(--color-foreground-accent)] w-full h-full"/>
                            </button>
                        </div>
                    }
                </div>
                <div 
                    className={`${canModify ? "grid md:grid-rows-[auto_1fr] grid-rows-1" : ""} h-full w-full`}>
                    {
                        canModify &&
                        <div
                            className="md:flex justify-end hidden">
                            <button
                                type="button"
                                className="w-10 h-10"
                                onClick={() => router.push(`${params.eventId}/edit`)}>
                                <PencilSquareIcon className="stroke-[var(--color-foreground)] hover:stroke-[var(--color-foreground-accent)] w-full h-full"/>
                            </button>
                        </div>
                    }
                    <span
                        className="text-2xl md:text-4xl text-[var(--color-disabled-foreground)] h-full flex items-end">
                        {eventDate?.toLocaleDateString("en-US", {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                        }) ?? ""}
                    </span>
                </div>
            </div>

            {/* Owed amount */}
            <div className="grid grid-rows-[min-content_1fr] text-center bg-[var(--color-good)] rounded-3xl p-5 w-full">
                <span className="block md:inline text-2xl md:text-3xl">
                    Owed
                </span>
                <div className="text-4xl md:text-6xl w-full truncate w-full max-w-[100%] inline-block">
                    ${event?.userTotalOwed ?? 0}
                </div>
            </div>

            {/* Debt amount */}
            <div className="grid grid-rows-[min-content_1fr] text-center bg-[var(--color-bad)] rounded-3xl p-5 w-full">
                <span className="block md:inline text-2xl md:text-3xl">
                    Debt
                </span>
                <div className="text-4xl md:text-6xl w-full truncate w-full max-w-[100%] inline-block">
                    ${event?.userTotalOwing ?? 0}
                </div>
            </div>

            {/* Activities */}
            <div className="col-span-2 md:col-span-1">
                <List title="Activities" items={activities} addItemLink={`/event/${params.eventId}/activity/create`} addItemText="Add Activity" allowModify={true}/>
            </div>

            {/* Participants */}
            <div className="h-[71dvh] grid grid-rows-[auto_1fr] gap-3 p-5 bg-[var(--color-bg-accent)] rounded-3xl md:col-span-2">
                <span className="text-center text-3xl md:text-4xl">Payers</span>
                <div className="overflow-y-auto scrollbar-custom rounded-3xl">
                    <div className="rounded-3xl grid gap-3 content-start min-h-full h-fit ml-1 mr-1 p-3">
                        {participants.map((participant) => (
                            <Disclosure 
                                key={participant.participantData.userId}
                                as="div" 
                                className="rounded-3xl bg-[var(--color-bg-alt-accent)] hover:bg-[var(--color-background)] text-2xl md:text-3xl w-full h-max group" 
                                defaultOpen={false}>
                                <DisclosureButton className="group flex w-full items-center justify-between p-6 pb-0 md:p-5 md:group-data-[headlessui-state=open]:pb-0">
                                    <span className="truncate w-[70dvw] md:max-w-[26dvw] inline-block text-left">
                                        {participant.participantData.displayName}
                                    </span>
                                    <ChevronDownIcon className="size-5 fill-white/60 group-data-hover:fill-white/50 group-data-open:rotate-180" />
                                </DisclosureButton>
                                <DisclosurePanel className="mt-2 p-6 pt-0 md:p-5 md:pt-0">
                                    <div>
                                        <div className="text-ellipsis truncate w-full md:max-w-[25dvw] max-w-[70dvw]">
                                            Email: {participant.participantData.email}
                                        </div>
                                        {
                                            participant.participantData.amountOwedToYou > 0 &&
                                            <div>
                                                Amount Owed To You: <span className="text-[var(--color-good)]">{participant.participantData.amountOwedToYou}</span>
                                                <div>
                                                    Has Paid: <span className={`${participant.participantData.hasPaid ? "text-[var(--color-good)]" : "text-[var(--color-bad)]"}`}>{participant.participantData.hasPaid ? "Yes" : "No"}</span>
                                                </div>
                                                {
                                                    !participant.participantData.hasPaid && 
                                                    <button
                                                        type="button"
                                                        className="rounded-lg p-2 md:p-3 bg-[var(--color-action)] hover:bg-[var(--color-action-accent)]"
                                                        onClick={RemindUserToPay}>
                                                        Remind User To Pay
                                                    </button>
                                                }
                                                {
                                                    participant.participantData.hasPaid && 
                                                    <button
                                                        type="button"
                                                        className="rounded-lg p-2 md:p-3 bg-[var(--color-action)] hover:bg-[var(--color-action-accent)]"
                                                        onClick={ConfirmParticipantPayment}>
                                                        {participant.participantData.paymentConfirmed ? "Confirm Payment" : "Unconfirm Payment"} 
                                                    </button>
                                                }
                                            </div>
                                        }
                                        {
                                            participant.participantData.amountOwedToYou < 0 &&
                                            <div>
                                                Amount You Owe: <span className="text-[var(--color-bad)]">{participant.participantData.amountOwedToYou * -1}</span>
                                                {
                                                    !participant.participantData.hasPaid && 
                                                    <div>
                                                        <button
                                                            type="button"
                                                            className="rounded-lg p-2 md:p-3 bg-[var(--color-action)] hover:bg-[var(--color-action-accent)]"
                                                            onClick={() => PayBackUser(participant.participantData.userId)}>
                                                            Pay back
                                                        </button>
                                                    </div>
                                                }
                                                {
                                                    participant.participantData.hasPaid && 
                                                    <div>
                                                        {
                                                            participant.participantData.paymentConfirmed &&
                                                            <div>
                                                                Payment Confirmed: <span className={`${participant.participantData.paymentConfirmed ? "text-[var(--color-good)]" : "text-[var(--color-bad)]"}`}>{participant.participantData.paymentConfirmed ? "Yes" : "No"}</span>
                                                            </div>
                                                        }
                                                        {
                                                            !participant.participantData.paymentConfirmed &&
                                                            <button
                                                                type="button"
                                                                className="rounded-lg p-2 md:p-3 bg-[var(--color-action)] hover:bg-[var(--color-action-accent)]"
                                                                onClick={RequestPaymentConfirmation}>
                                                                Request Payment Confirmation
                                                            </button>
                                                        }
                                                    </div>
                                                }
                                            </div>
                                        }
                                    </div>
                                </DisclosurePanel>
                            </Disclosure>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}