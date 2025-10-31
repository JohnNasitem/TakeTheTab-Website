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
        <div className="pageSection p-3 grid md:grid-rows-[auto_1fr] grid-cols-1 md:grid-cols-[64.4fr_34fr] gap-4">

            {/* Activity name*/}
            <div className="text-3xl md:text-7xl md:col-span-1 grid grid-cols-[1fr_auto] w-full gap-4 bg-[var(--color-bg-accent)] rounded-3xl p-5">
                <h1 className="md:flex md:items-end h-max font-bold text-ellipsis truncate max-w-[100%] items-center">
                    {activity?.activityName ?? ""} 
                </h1>
                {
                    activity?.isPayee &&
                    <div
                        className="flex justify-end">
                        <button
                            type="button"
                            className="w-10 h-10"
                            onClick={() => router.push(`${params.activityId}/edit`)}>
                            <PencilSquareIcon className="stroke-[var(--color-foreground)] group-hover:stroke-[var(--color-foreground-accent)] w-full h-full"/>
                        </button>
                    </div>
                }
            </div>

            {/* Owed/Debt amount */}
            <div className={`grid grid-rows-[auto_1fr] text-center rounded-3xl p-5  ${activity?.isPayee ? "bg-[var(--color-good)]" : "bg-[var(--color-bad)]"}`}>
                <span className="block md:inline text-2xl md:text-3xl">
                    {activity?.isPayee ? "Owed" : "Debt"}
                </span>
                <div className="text-4xl md:text-6xl w-full truncate w-full max-w-[100%] inline-block">
                    ${activity?.amount ?? 0}
                </div>
            </div>

            {/* Items */}
            <div className="bg-[var(--color-bg-accent)] rounded-3xl p-5 grid gap-3 content-start">
                {activity?.items?.map((item) => (
                    <Disclosure 
                        key={item.itemId}
                        as="div" 
                        className="rounded-3xl bg-[var(--color-bg-alt-accent)] hover:bg-[var(--color-background)] text-2xl md:text-3xl w-full h-max group" 
                        defaultOpen={false}>
                        <DisclosureButton className="group flex w-full items-center justify-between p-6 pb-0 md:p-5 md:group-data-[headlessui-state=open]:pb-0">
                            <span className="">
                                {item.itemName}
                            </span>
                            <ChevronDownIcon className="size-5 fill-white/60 group-data-hover:fill-white/50 group-data-open:rotate-180" />
                        </DisclosureButton>
                        <DisclosurePanel className="mt-2 p-6 pt-0 md:p-5 md:pt-0">
                            <div>
                                <div className="truncate w-full max-w-[100%] inline-block">
                                    Subtotal: ${item.itemCost}
                                </div>
                                <div className="truncate w-full max-w-[100%] inline-block">
                                    Tax: ${activity.addFivePercentTax ? (item.itemCost * 0.05).toFixed(2) : 0}
                                </div>
                                <div className="truncate w-full max-w-[100%] inline-block">
                                    GrandTotal: ${activity.addFivePercentTax ? (item.itemCost * 1.05).toFixed(2) : item.itemCost.toFixed(2)}
                                </div>
                                <div className="truncate w-full max-w-[100%] inline-block">
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
                    className="rounded-3xl bg-[var(--color-action)] hover:bg-[var(--color-action-accent)] text-2xl md:text-3xl w-full h-max group" 
                    defaultOpen={false}>
                    <DisclosureButton className="group flex w-full items-center justify-between p-6 pb-0 md:p-5 md:group-data-[headlessui-state=open]:pb-0">
                        <span className="">
                            Grand Total: ${getActivityGrandTotal().toFixed(2)}
                        </span>
                        <ChevronDownIcon className="size-5 fill-white/60 group-data-hover:fill-white/50 group-data-open:rotate-180" />
                    </DisclosureButton>
                    <DisclosurePanel className="mt-2 p-6 pt-0 md:p-5 md:pt-0">
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
                <span className="text-center text-3xl md:text-4xl">Payers</span>
                {activity?.payers?.map((payer) => (
                    <Disclosure 
                        key={payer.payerId}
                        as="div" 
                        className="rounded-3xl bg-[var(--color-bg-alt-accent)] hover:bg-[var(--color-background)] text-2xl md:text-3xl w-full h-max group" 
                        defaultOpen={false}>
                        <DisclosureButton className="group flex w-full items-center justify-between p-6 pb-0 md:p-5 md:group-data-[headlessui-state=open]:pb-0">
                            <span className="">
                                {payer.payerName}
                            </span>
                            <ChevronDownIcon className="size-5 fill-white/60 group-data-hover:fill-white/50 group-data-open:rotate-180" />
                        </DisclosureButton>
                        <DisclosurePanel className="mt-2 p-6 pt-0 md:p-5 md:pt-0">
                            <div>
                                <div className="truncate w-full max-w-[100%] inline-block">
                                    Email: {payer.payerEmail}
                                </div>
                                <div className="truncate w-full max-w-[100%] inline-block">
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