import { useCallback } from "react";
import { sendApiCall } from "@/components/server-api-serivces/api-util";
import { FetchActivityResponse, GenericResponse, CreateActivityResponse } from "@/interfaces/server-responses";
import { ActivityItem } from "@/interfaces/parameters"

const serverPath = "https://api.takethetab.com/events";

interface CreateActivityType {
    eventId: number;
    activityName: string;
    isGratuityTypePercent: boolean;
    gratuityAmount: number; 
    includeTax: boolean;
    items: ActivityItem[];
}

interface GenericActivityRequestType {
    eventId: number;
    activityId: number;
}

interface UpdateActivityType extends GenericActivityRequestType{
    activityName: string;
    isGratuityTypePercent: boolean;
    gratuityAmount: number;
    addFivePercentTax: boolean;
    items: ActivityItem[];
}

export const ActivityApiService = () => {
    const createActivity = useCallback(async (createActivityData: CreateActivityType): Promise<CreateActivityResponse> => {
        return await sendApiCall<CreateActivityResponse>(`${serverPath}/${createActivityData.eventId}/activities`, "POST", JSON.stringify({ 
            EventId: createActivityData.eventId,
            ActivityName: createActivityData.activityName, 
            IsGratuityTypePercent: createActivityData.isGratuityTypePercent,
            GratuityAmount: createActivityData.gratuityAmount,
            IncludeTax: createActivityData.includeTax,
            Items: createActivityData.items
        }));
    }, []);

    const deleteActivity = useCallback(async (deleteActivityData: GenericActivityRequestType): Promise<GenericResponse> => {
        return await sendApiCall<GenericResponse>(`${serverPath}/${deleteActivityData.eventId}/activities/${deleteActivityData.activityId}`, "DELETE");
    }, []);

    const fetchActivity = useCallback(async (fetchActivityData: GenericActivityRequestType): Promise<FetchActivityResponse> => {
        return await sendApiCall<FetchActivityResponse>(`${serverPath}/${fetchActivityData.eventId}/activities/${fetchActivityData.activityId}`, "GET");
    }, []);

    const updateActivity = useCallback(async (updateActivitydata: UpdateActivityType): Promise<GenericResponse> => {
        return await sendApiCall<GenericResponse>(`${serverPath}/${updateActivitydata.eventId}/activities/${updateActivitydata.activityId}`, "PUT", JSON.stringify({ 
            ActivityName: updateActivitydata.activityName,
            IsGratuityTypePercent: updateActivitydata.isGratuityTypePercent,
            GratuityAmount: updateActivitydata.gratuityAmount,
            AddFivePercentTax: updateActivitydata.addFivePercentTax,
            Items: updateActivitydata.items
        }));
    }, []);

    return { createActivity, deleteActivity, fetchActivity, updateActivity };
}