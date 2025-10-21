"use client";

import { useState, useEffect } from "react";
import { ActivityApiService } from "@/components/server-api-serivces/activity-api-service"
import { useRouter, useParams  } from "next/navigation";
import { FetchActivityResponse } from '@/interfaces/server-responses'
import { ChevronDownIcon, PencilSquareIcon } from '@heroicons/react/20/solid'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'

export default function FetchActivityPage() {
    const { fetchActivity } = ActivityApiService();
    const router = useRouter();
    const params = useParams();
    
    const [activity, setActvity] = useState<FetchActivityResponse>();
    useEffect(() => {
        const getActivity = async () => {
            console.log("Fetching activity with  event id: ", params.eventId , " and activity id: ", params.activityId);

            if (isNaN(Number(params.eventId))) {
                alert("Invalid event id");
                router.push("/");
                return;
            }
            else if (isNaN(Number(params.activityId))) {
                alert("Invalid activity id");
                router.push("/event/" + params.eventId);
                return;
            }
            
            const activityData = await fetchActivity({ eventId: Number(params.eventId), activityId: Number(params.activityId) });

            if (!activityData.actionSuccess) {
                alert(activityData.errorMessage);
                router.push("/event/" + params.eventId);
                return;
            }
            
            console.log("Setting activity");
            setActvity(activityData);
        }
    
        getActivity();
        }, [fetchActivity, params.eventId, params.activityId, router]);

    const getActivityGrandTotal = (): number => {
        if (!activity)
            return 0;

        const taxAmount = activity.addFivePercentTax ? activity.activitySubtotal! * 0.05 : 0;
        const gratuityAmount = activity.isGratuityTypePercent ? activity.activitySubtotal! * activity.gratuityAmount! / 100.0 : activity.gratuityAmount!;

        return activity!.activitySubtotal! + taxAmount + gratuityAmount;
    }

    return (
        // Entire Page
        <div className="pageSection p-3 grid md:grid-rows-[auto_1fr] grid-cols-1 md:grid-cols-[66fr_34fr] gap-4">

            {/* Activity name*/}
            <div className="text-3xl md:text-7xl md:col-span-1 grid grid-cols-[1fr_auto] w-full gap-4 bg-[var(--color-bg-accent)] rounded-3xl p-5">
                <span className="md:flex md:items-end h-max font-bold text-ellipsis truncate max-w-[80dvw] md:max-w-[60dvw] items-center">
                    {activity?.activityName ?? ""} 
                </span>
                {
                    activity?.isPayee &&
                    <div
                        className="flex justify-end">
                        <button
                            type="button"
                            className="w-7 h-7"
                            onClick={() => router.push(`${params.activityId}/edit`)}>
                            <PencilSquareIcon className="stroke-[var(--color-foreground)] group-hover:stroke-[var(--color-foreground-accent)] w-full h-full"/>
                        </button>
                    </div>
                }
            </div>

            {/* Owed/Debt amount */}
            <div className="grid grid-rows-[auto_1fr] text-center bg-[var(--color-bg-accent)] rounded-3xl p-5">
                <span className="block md:inline text-2xl md:text-3xl">
                    {activity?.isPayee ? "Owed" : "Debt"}
                </span>
                <div className={`text-4xl md:text-6xl w-full ${activity?.isPayee ? "text-[var(--color-good)]" : "text-[var(--color-bad)]"}`}>
                    ${activity?.amount ?? 0}
                </div>
            </div>

            {/* Items */}
            <div className="bg-[var(--color-bg-accent)] rounded-3xl p-5 grid gap-3 content-start">
                {activity?.items?.map((item) => (
                    <Disclosure 
                        key={item.itemId}
                        as="div" 
                        className="p-6 rounded-3xl bg-[var(--color-bg-alt-accent)] hover:bg-[var(--color-background)] md:p-5 text-2xl md:text-3xl w-full h-max" 
                        defaultOpen={false}>
                        <DisclosureButton className="group flex w-full items-center justify-between">
                            <span className="">
                                {item.itemName}
                            </span>
                            <ChevronDownIcon className="size-5 fill-white/60 group-data-hover:fill-white/50 group-data-open:rotate-180" />
                        </DisclosureButton>
                        <DisclosurePanel className="mt-2">
                            <div>
                                <div className="text-ellipsis truncate w-full md:max-w-[20dvw] max-w-[70dvw]">
                                    Subtotal: ${item.itemCost}
                                </div>
                                <div className="text-ellipsis truncate w-full md:max-w-[20dvw] max-w-[70dvw]">
                                    Tax: ${activity.addFivePercentTax ? (item.itemCost * 0.05).toFixed(2) : 0}
                                </div>
                                <div className="text-ellipsis truncate w-full md:max-w-[20dvw] max-w-[70dvw]">
                                    GrandTotal: ${activity.addFivePercentTax ? (item.itemCost * 1.05).toFixed(2) : item.itemCost.toFixed(2)}
                                </div>
                                <div className="text-ellipsis truncate w-full md:max-w-[20dvw] max-w-[70dvw]">
                                    Split Type: {item.isSplitEvently ? "Evenly" : "Custom" }
                                </div>
                                {item.payers.map((payer) => (
                                    <div
                                        key={`item-payer-${payer.payerId}`}>
                                        <span className="text-ellipsis truncate">{payer.payerName} | {payer.payerEmail}</span> : ${(activity.addFivePercentTax ? payer.amountOwing * 1.05 : payer.amountOwing).toFixed(2)}
                                    </div>
                                ))
                                }
                            </div>
                        </DisclosurePanel>
                    </Disclosure>
                ))
                }
                <Disclosure 
                    as="div" 
                    className="p-6 rounded-3xl bg-[var(--color-action)] hover:bg-[var(--color-action-accent)] md:p-5 text-2xl md:text-3xl w-full h-max" 
                    defaultOpen={false}>
                    <DisclosureButton className="group flex w-full items-center justify-between">
                        <span className="">
                            Grand Total: ${getActivityGrandTotal().toFixed(2)}
                        </span>
                        <ChevronDownIcon className="size-5 fill-white/60 group-data-hover:fill-white/50 group-data-open:rotate-180" />
                    </DisclosureButton>
                    <DisclosurePanel className="mt-2">
                        <div>
                            <div className="text-ellipsis truncate w-full md:max-w-[50dvw] max-w-[70dvw]">
                                Activity Subtotal: ${(activity?.activitySubtotal ?? 0).toFixed(2)}
                            </div>
                            <div className="text-ellipsis truncate w-full md:max-w-[50dvw] max-w-[70dvw]">
                                Tax ({activity?.addFivePercentTax ? "5" : "0"}%) : ${(activity?.addFivePercentTax ? activity.activitySubtotal! * 0.05 : 0).toFixed(2)}
                            </div>
                            <div className="text-ellipsis truncate w-full md:max-w-[50dvw] max-w-[70dvw]">
                                Gratuity {activity?.isGratuityTypePercent ? `(${activity.gratuityAmount!.toFixed(0)}%) ` : ""}: ${(activity?.isGratuityTypePercent ? activity.activitySubtotal! * activity.gratuityAmount! / 100.0 : activity?.gratuityAmount ?? 0).toFixed(2)}
                            </div>
                            <div className="text-ellipsis truncate w-full md:max-w-[50dvw] max-w-[70dvw]">
                                GrandTotal: ${getActivityGrandTotal().toFixed(2)}
                            </div>
                        </div>
                    </DisclosurePanel>
                </Disclosure>
            </div>

            {/* Payers */}
            <div className={`rounded-3xl bg-[var(--color-bg-accent)] p-5 grid gap-3 content-start h-full w-full`}>
                <h1 className="text-center text-3xl md:text-4xl">Payers</h1>
                {activity?.payers?.map((payer) => (
                    <Disclosure 
                        key={payer.payerId}
                        as="div" 
                        className="p-6 rounded-3xl bg-[var(--color-bg-alt-accent)] hover:bg-[var(--color-background)] md:p-5 text-2xl md:text-3xl w-full h-max" 
                        defaultOpen={false}>
                        <DisclosureButton className="group flex w-full items-center justify-between">
                            <span className="">
                                {payer.payerName}
                            </span>
                            <ChevronDownIcon className="size-5 fill-white/60 group-data-hover:fill-white/50 group-data-open:rotate-180" />
                        </DisclosureButton>
                        <DisclosurePanel className="mt-2">
                            <div>
                                <div className="text-ellipsis truncate w-full md:max-w-[20dvw] max-w-[70dvw]">
                                    Email: {payer.payerEmail}
                                </div>
                                <div className="text-ellipsis truncate w-full md:max-w-[20dvw] max-w-[70dvw]">
                                    Debt: <span className="text-[var(--color-bad)]">${payer.amountOwing.toFixed(2)}</span>
                                </div>
                            </div>
                        </DisclosurePanel>
                    </Disclosure>
                ))}
            </div>
        </div>
    );
}