"use client";

import ActivityForm from "@/components/activity-form";
import { ActivityApiService } from "@/components/server-api-serivces/activity-api-service"
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { FetchActivityResponse } from "@/interfaces/server-responses";

export default function CreateEventPage() {
    const router = useRouter();
    const params = useParams();
    const { fetchActivity } = ActivityApiService();

    const [activity, setActivity] = useState<FetchActivityResponse | null>(null);

    useEffect(() => {
        const getEvent = async () => {
            console.log("Fetching event with id: ", params.eventId);
            
            if (isNaN(Number(params.eventId))) {
                alert("Invalid event id");
                router.push("/");
                return;
            }

            if (isNaN(Number(params.activityId))) {
                alert("Invalid activity id");
                router.push(`/event/${params.eventId}`);
                return;
            }

            const a = await fetchActivity({
                eventId: Number(params.eventId as string),
                activityId: Number(params.activityId as string)
            });

            if (a.actionSuccess)
                setActivity(a);
            else {
                alert(a.errorMessage);
                router.push(`/event/${params.eventId}`);
                return;
            }
        }
        
        console.log("Edit useEffect ran");
        getEvent();
    }, [fetchActivity, params.eventId, params.activityId, router])

    return (
        activity &&
        <ActivityForm 
            title="Edit Activity"
            isCreatingActivity={false}
            activityName={activity?.activityName ?? "Error"}
            items={activity.items
                ? activity.items.map(item => ({
                    itemId: item.itemId,
                    itemName: item.itemName,
                    itemCost: item.itemCost,
                    splitEvenly: item.isSplitEvently,
                    itemOwers: Object.fromEntries(
                        item.payers.map(payer => [
                        payer.payerId,
                        [payer.payerName, payer.payerEmail, payer.amountOwing] as [string, string, number],
                        ])
                    ),
                    }))
                : undefined}
            isGratuityTypePercent={activity.isGratuityTypePercent ?? true}
            gratuityAmount={activity.gratuityAmount ?? 0}
            addFivePercentTax={activity.addFivePercentTax ?? true}
        />
    );
}