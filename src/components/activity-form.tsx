"use client";

import { useState, useEffect } from "react";
import { EventApiService } from "@/components/server-api-serivces/event-api-service"
import { UserApiService } from "@/components/server-api-serivces/user-api-service"
import { ActivityApiService } from "@/components/server-api-serivces/activity-api-service"
import { useRouter, useParams } from "next/navigation";
import ToggleSelect from '@/components/toggle-select'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import SearchDropdown from "@/components/search-dropdown"
import { FetchEventResponseParticipant } from '@/interfaces/server-responses'



interface ActivityItemLocal { 
    itemId?: number;
    itemName: string;
    itemCost: number;
    splitEvenly: boolean;
    itemOwers: Record<number, [string, string, number]>;
}

interface ActivityFormProps {
    title: string;
    isCreatingActivity: boolean;
    activityName?: string | undefined;
    items?: ActivityItemLocal[] | undefined;
    isGratuityTypePercent?: boolean | undefined;
    gratuityAmount?: number | undefined;
    addFivePercentTax?: boolean | undefined;
}


export default function ActivityForm(formData: ActivityFormProps) {
    const { fetchEvent } = EventApiService();
    const { fetchUser } = UserApiService();
    const { createActivity, updateActivity } = ActivityApiService();
    const router = useRouter();
    const params = useParams();

    // Error messages
    const [showNameErrorMessage, setShowNameErrorMessage] = useState(false);
    const [showPayerErrorMessage, setShowPayerErrorMessage] = useState(false);
    const [showRequestErrorMessage, setShowRequestErrorMessage] = useState(false);
    const [requestErrorMessage, setRequestErrorMessage] = useState("");

    const [participants, setParticipants] = useState<Record<number, [string, string]>>([]);
    const [showGratuityErrorMessage, setShowGratuityErrorMessage] = useState(false);
    const [isGratuityPertcent, setIsGratuityPertcent] = useState(formData.isGratuityTypePercent as boolean ?? true);
    const [includeTax, setIncludeTax] = useState(formData.addFivePercentTax as boolean ?? true);
    const [currentUser, setCurrentUser] = useState<[number, string, string]>([-1, "", ""]);
    const [activityName, setActivityName] = useState(formData.activityName ?? "");
    const [gratuityAmount, setGratuityAmount] = useState<number | string>(formData.gratuityAmount ?? "");

    // For add item
    const [items, setItems] = useState<ActivityItemLocal[]>(formData.items ?? []);
    const [showItemNameErrorMessage, setShowItemNameErrorMessage] = useState(false);
    const [showItemCostErrorMessage, setShowItemCostErrorMessage] = useState(false);
    const [showNoItemPayersErrorMessage, setShowNoItemPayersErrorMessage] = useState(false);
    const [splitEvenly, setSplitEvenly] = useState(true);
    const [showPayerAmountErrorMessage, setShowPayerAmountErrorMessage] = useState(false);
    const [payerAmountErrorMessage, setPayerAmountErrorMessage] = useState("");
    const [availableItemParticipants, setAvailableItemParticipants] = useState<Record<number, [string, string]>>([]);
    const [itemPayerParticipants, setItemPayerParticipants] = useState<Record<number, [string, string]>>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [itemPeopleOwing, setItemPeopleOwing] = useState<Record<number, number | undefined>>({});

    const removeItem = (itemToRemove: ActivityItemLocal) => {
        setItems(prevItems => prevItems.filter(item => item !== itemToRemove))
    }

    const addItemPayer = (friend: [number, [string, string]]) =>  {
        console.log("Adding participant: ", friend);
        setItemPayerParticipants(prev => {
            const next = {
            ...prev,
            [friend[0]]: friend[1]
            };

            if (splitEvenly)
                splitCostEvenly(next);

            return next;
        });
        setAvailableItemParticipants(prev => {
            const { [friend[0]]: _, ...rest } = prev;
            return rest;
        });
    }

    const removeItemPayer = (participant: [number, [string, string]]) =>  {
        console.log("Removing participant: ", participant);
        setAvailableItemParticipants(prev => ({
            ...prev,
            [participant[0]]: participant[1]
        }));
        setItemPayerParticipants(prev => {
            const { [participant[0]]: _, ...rest } = prev;

            if (splitEvenly)
                splitCostEvenly(rest);

            return rest;
        });
    }

    const handleItemPeopleOwingChange = (participantId: number, value: string, itemCost: number) => {
        setItemPeopleOwing(prev => {
            const next = {
            ...prev,
            [participantId]: value === "" ? undefined : Number(value),
            };

            // Calculate total from the updated object
            const totalOwing = Object.values(next)
                .map(amount => amount ?? 0)
                .reduce((sum, amount) => sum + amount, 0);

            // Run your validation here
            if (totalOwing !== itemCost) {
                setShowPayerAmountErrorMessage(true);
                setPayerAmountErrorMessage(
                    totalOwing >= itemCost
                    ? "Total owing exceeds item cost."
                    : "Total owing is under item cost."
            );
            } else {
                setShowPayerAmountErrorMessage(false);
            }

            // Return the updated state
            return next;
        });
    };

    const splitCostEvenly = (customParticipants?: Record<number, [string, string]>) => {
        setShowPayerAmountErrorMessage(false);
        const activeParticipants = customParticipants ?? itemPayerParticipants;
        const evenSplit = Math.round((Number((document.getElementById("new-item-cost") as HTMLInputElement)?.value ?? 0) / Object.keys(activeParticipants).length) * 100) / 100;

        Object.keys(activeParticipants).forEach((participantId) => {
            setItemPeopleOwing(prev => ({
                ...prev,
                [Number(participantId)]: evenSplit
            }));
        });
    }

    useEffect(() => {
        const getEvent = async () => {
            console.log("Fetching event with id: ", params.eventId);
            const eventData = await fetchEvent(Number(params.eventId))
            const userData = await fetchUser()

            if (!eventData.actionSuccess || !userData.actionSuccess) {
                alert("Server error occured!");
                return;
            }

            const curUser = [userData.userId ?? -1, userData.userDisplayName ?? "", userData.userEmail ?? ""] as [number, string, string];
            setCurrentUser(curUser);
            
            const eventParticipants = eventData.participants as FetchEventResponseParticipant[];

            setAvailableItemParticipants(eventParticipants.reduce(
                (acc, participant) => {
                    acc[participant.userId] = [participant.displayName, participant.email];
                    return acc;
                },
                {
                    [curUser[0]]: [curUser[1], curUser[2]] as [string, string]
                } as Record<number, [string, string]>
            ));


            setParticipants(eventParticipants.reduce(
                (acc, participant) => {
                    acc[participant.userId] = [participant.displayName, participant.email];
                    return acc;
                },
                {} as Record<number, [string, string]>
            ));
        }

        setActivityName(formData.activityName ?? "")
        getEvent();
        }, [fetchEvent, fetchUser, params.eventId, formData.activityName]);

    const handleCreateActivity = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formInutData = new FormData(e.currentTarget);
        const activityName = formInutData.get("activity-name") as string;
        const gratuityAmountStr = formInutData.get("gratuity-amount") as string;
        let errorsExist = false;

        if (!activityName || activityName.trim() === "") {
            setShowNameErrorMessage(true);
            errorsExist = true;
        }
        else 
            setShowNameErrorMessage(false);
        if (items.length == 0) {
            setShowPayerErrorMessage(true);
            errorsExist = true;
        }
        else
            setShowPayerErrorMessage(false);
        if (!gratuityAmountStr || gratuityAmountStr.trim() === "") {
            setShowGratuityErrorMessage(true);
            errorsExist = true;
        }
        else 
            setShowGratuityErrorMessage(false);

        if (errorsExist)
            return;

        if (formData.isCreatingActivity) {
            const data = await createActivity({ 
                eventId: Number(params.eventId as string),
                activityName: activityName,
                isGratuityTypePercent: isGratuityPertcent,
                gratuityAmount: Number(gratuityAmountStr),
                includeTax: includeTax,
                items: items.map((item) => ({
                    itemName: item.itemName,
                    itemCost: item.itemCost,
                    isSplitTypeEvenly: item.splitEvenly,
                    payers: Object.fromEntries(
                        Object.entries(item.itemOwers).map(([key, [, , amount]]) => [Number(key), amount])
                    ),
                }))
            });

            if (data.actionSuccess)
                router.push(`/event/${params.eventId}/activity/${data.activityId}`)
            else {
                setRequestErrorMessage(data.errorMessage!);
                setShowRequestErrorMessage(true);
            }
        }
        else {
            const data = await updateActivity({
                eventId: Number(params.eventId as string),
                activityId: Number(params.activityId as string),
                activityName: activityName,
                isGratuityTypePercent: isGratuityPertcent,
                gratuityAmount: gratuityAmount as number,
                addFivePercentTax: includeTax,
                items: items.map((item) => ({
                    itemId: item.itemId,
                    itemName: item.itemName,
                    itemCost: item.itemCost,
                    isSplitTypeEvenly: item.splitEvenly,
                    payers: Object.fromEntries(
                        Object.entries(item.itemOwers).map(([key, [, , amount]]) => [Number(key), amount])
                    ),
                }))
            });

            if (data.actionSuccess)
                router.push(`/event/${params.eventId}/activity/${params.activityId}`)
            else {
                setRequestErrorMessage(data.errorMessage!);
                setShowRequestErrorMessage(true);
            }
        }
    }

    const handleAddItem = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const formData = new FormData(e.currentTarget);
        const itemName = formData.get("item") as string;
        const itemCost = Number(formData.get("item-cost") as string);
        let errorsExist = false;

        // Validate form
        if (!itemName || itemName.trim() === "") {
            setShowItemNameErrorMessage(true);
            errorsExist = true;
        }
        else 
            setShowItemNameErrorMessage(false);
        if (itemCost <= 0) {
            setShowItemCostErrorMessage(true);
            errorsExist = true;
        }
        else 
            setShowItemCostErrorMessage(false);
        if (Object.keys(itemPayerParticipants).length == 0) {
            setShowNoItemPayersErrorMessage(true);
            errorsExist = true;
        }
        else 
            setShowNoItemPayersErrorMessage(false);
        if (errorsExist)
            return;

        // Add to item list
        const newItem: ActivityItemLocal = { 
            itemName: itemName, 
            itemCost: itemCost, 
            splitEvenly: splitEvenly, 
            itemOwers: Object.keys(itemPayerParticipants).reduce((acc, key) => {
                const k = Number(key);
                acc[k] = [...itemPayerParticipants[k], itemPeopleOwing[k]] as [string, string, number];
                return acc;
            }, {} as Record<number, [string, string, number]>)};

        setItems(prev => [...prev, newItem]);

        setIsOpen(false);
    }

    return (
        <div className="pageSection flex text-1xl md:text-2xl">
            <form
                onSubmit={handleCreateActivity}
                className="self-center grid grid-cols-1 bg-[var(--color-bg-accent)] place-items-center rounded-lg p-10 mx-auto w-[90dvw] md:w-[50dvw] h-max gap-3 md:gap-6">
                {/* Title */}
                <h1 className="text-3xl md:text-4xl">{formData.title}</h1>

                {/* Activity Name */}
                <div
                    className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4 md:gap-8 w-full">
                    <div className="flex place-items-center h-max md:h-full w-full">
                        <label htmlFor="create-activity-activity-name">
                            Activity Name:
                        </label>
                    </div>
                    <input 
                        type="text" 
                        id="create-activity-activity-name" 
                        name="activity-name" 
                        value={activityName}
                        onChange={(e) => setActivityName(e.target.value)}
                        className="p-3 bg-[var(--color-background)] rounded-lg w-full"/>
                    {
                        showNameErrorMessage &&
                        <div className="text-[var(--color-bad)] text-sm md:text-lg md:col-span-2 text-center">
                            Activity name cannot be empty.
                        </div>
                    }
                </div>

                <div className="w-full">
                    <hr className="border-t border-[var(--color-border)] my-2" />
                </div>

                {/* Add item */}
                <div 
                    className="w-full grid grid-cols-1 gap-2">
                    <div
                        className="grid w-full grid-cols-[1fr_auto]">
                        <div className="flex place-items-center h-max md:h-full w-full">
                            Items:
                        </div>
                        <button 
                            type="button" 
                            className="bg-[var(--color-bg-alt-accent)] p-3 rounded-lg"
                            onClick={() => {
                            // Reset add item dialog state
                            setSplitEvenly(true);
                            setItemPeopleOwing({});
                            setShowPayerAmountErrorMessage(false);
                            setAvailableItemParticipants({
                                ...participants,
                                [currentUser[0]]: [currentUser[1], currentUser[2]] as [string, string]
                            });
                            setItemPayerParticipants([]);
                            
                            // Open dialog
                            setIsOpen(true)
                        }}>
                            Add Item ✚
                        </button>
                    </div>
                    {items.map(
                        (item, index) => (
                            <div 
                                key={index}
                                className="grid grid-cols-1 p-3 rounded-lg gap-2 border-2 w-full mt-4">
                                <div
                                    className="grid grid-cols-[1fr_auto]">
                                    <div className="w-full truncate">
                                        Item: {item.itemName}
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => removeItem(item)} className="text-[var(--color-bad)]">
                                        X
                                    </button>
                                </div>
                                <div className="w-full">
                                    Cost: ${item.itemCost}
                                </div>
                                <div className="w-full">
                                    Payers:
                                </div>
                                {Object.entries(item.itemOwers).map(
                                    (payer, index) => (
                                        <div
                                            key={index}
                                            className="grid grid-cols-[auto_1fr] gap-1">
                                            <div>
                                                {payer[1][0]} | {payer[1][1]}:
                                            </div>
                                            <div>
                                                ${payer[1][2]}
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        )
                    )}
                </div>

                {
                    showPayerErrorMessage &&
                    <div className="text-[var(--color-bad)] text-sm md:text-lg">
                        Must add at least 1 item!
                    </div>
                }

                {/* Add item dialog */}
                <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
                    <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-black/50">
                    <DialogPanel className="max-w-[80dvh] w-full space-y-4 border bg-[var(--color-bg-accent)] rounded-lg p-5 md:p-12">
                        <DialogTitle className="font-bold text-center text-3xl md:text-4x1">Add Item</DialogTitle>
                        <form
                            onSubmit={handleAddItem}
                            className="text-1xl md:text-3x1">
                            {/* Item name */}
                            <div className="grid grid-cols-[auto_1fr] gap-2 md:gap-4 w-full mb-4">
                                <div
                                    className="flex place-items-center h-full w-full">
                                    <label htmlFor="new-activity-item">Item Name:</label>
                                </div>
                                <input 
                                    type="text" 
                                    id="new-activity-item"
                                    name="item"
                                    className="bg-[var(--color-bg-alt-accent)] rounded-lg p-1 md:p-3 w-full"/>
                                {
                                    showItemNameErrorMessage &&
                                    <div className="text-[var(--color-bad)] text-sm md:text-lg md:col-span-2 text-center">
                                        Item name cannot be empty.
                                    </div>
                                }
                            </div>

                            {/* Item Cost */}
                            <div className="grid grid-cols-[auto_1fr] gap-4 w-full mb-4">
                                <div
                                    className="flex place-items-center h-full w-full">
                                    Item Cost:
                                </div>
                                <div className="grid grid-cols-[auto_1fr] place-items-end h-full align-center">
                                    <div
                                        className="flex place-items-center h-full w-full">
                                        $
                                    </div>
                                    <input 
                                        type="number" 
                                        id="new-item-cost" 
                                        name="item-cost" 
                                        step="0.01"
                                        onChange={() => {
                                            if (splitEvenly) 
                                                splitCostEvenly();
                                            else {
                                                const totalOwing = Object.values(itemPeopleOwing)
                                                    .map(amount => amount ?? 0)
                                                    .reduce((sum, amount) => sum + amount, 0);

                                                const itemCost = Number((document.getElementById("new-item-cost") as HTMLInputElement)?.value ?? 0);
                                                
                                                if (totalOwing !== itemCost) {
                                                    setShowPayerAmountErrorMessage(true);
                                                    setPayerAmountErrorMessage(
                                                        totalOwing >= itemCost
                                                        ? "Total owing exceeds item cost."
                                                        : "Total owing is under item cost."
                                                    );
                                                }
                                            }
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === "e" || e.key === "E" || e.key === "+" || e.key === "-") {
                                            e.preventDefault();
                                            }
                                        }}
                                        className="p-1 md:p-3 bg-[var(--color-bg-alt-accent)] rounded-lg w-full"/>
                                </div>
                                {
                                        showItemCostErrorMessage &&
                                        <div className="text-[var(--color-bad)] text-sm md:text-lg md:col-span-2 text-center">
                                            Item cost must be a positive number.
                                        </div>
                                    }
                            </div>

                            {/* Split Type */}
                            <ToggleSelect
                                toggleName="Split Type:"
                                leftLabel="Evenly"
                                rightLabel="Custom"
                                onChange={(isEven) => {
                                    // Reset people owing to even
                                    if (isEven) 
                                        splitCostEvenly();
                                    else {
                                        const totalOwing = Object.values(itemPeopleOwing)
                                            .map(amount => amount ?? 0)
                                            .reduce((sum, amount) => sum + amount, 0);

                                        const itemCost = Number((document.getElementById("new-item-cost") as HTMLInputElement)?.value ?? 0);
                                        
                                        if (totalOwing !== itemCost) {
                                            setShowPayerAmountErrorMessage(true);
                                            setPayerAmountErrorMessage(
                                                totalOwing >= itemCost
                                                ? "Total owing exceeds item cost."
                                                : "Total owing is under item cost."
                                            );
                                        }
                                    }

                                    setSplitEvenly(isEven);
                                }}
                            />

                            {/* Payer Selection */}
                            <div className="h-max md:h-full flex place-items-center w-full">
                                <span>
                                    Payers:
                                </span>
                            </div>
                            <div
                                className="mb-4 mt-4 w-full">
                                <SearchDropdown
                                    placeholder="Search participants..."
                                    data={availableItemParticipants}
                                    onSelect={(id, value) => addItemPayer([Number(id), value])}
                                    displayFn={(value) => `${value[0]} | ${value[1]}`}
                                />
                            </div>
                            {
                                showPayerAmountErrorMessage &&
                                <div className="text-[var(--color-bad)] text-sm md:text-lg">
                                    {payerAmountErrorMessage}
                                </div>
                            }

                            {/* Selected Payers */}
                            <ul 
                                className="grid grid-cols-1 gap-2 w-full rounded-lg max-h-[20dvh] overflow-y-auto content-start mb-4">
                                {Object.entries(itemPayerParticipants)
                                    .sort((a, b) => a[1][0].localeCompare(b[1][0]))
                                    .map(p => (
                                    <li key={p[0]} className="px-3 py-1 rounded items-center gap-1 grid grid-cols-[1fr_auto] h-max">
                                        <div 
                                            key={p[0]}
                                            className="grid grid-cols-[auto_1fr] rounded-lg w-full gap-2">
                                            <div
                                                className="flex place-items-center h-full w-full truncate">
                                                {p[1][0]} | {p[1][1]}
                                            </div>
                                            <div className="grid grid-cols-[auto_1fr] place-items-end h-full align-center w-full">
                                                <div
                                                    className="flex place-items-center h-full w-full">
                                                    $
                                                </div>
                                                <input
                                                    type="number"
                                                    name={`participant-${p[0]}`}
                                                    value={itemPeopleOwing[Number(p[0])] ?? ""}
                                                    readOnly={splitEvenly}
                                                    onChange={(e) => handleItemPeopleOwingChange(Number(p[0]), e.target.value, Number((document.getElementById("new-item-cost") as HTMLInputElement)?.value ?? 0))}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "e" || e.key === "E" || e.key === "+" || e.key === "-") {
                                                        e.preventDefault();
                                                        }
                                                    }}
                                                    className="p-1 bg-[var(--color-bg-alt-accent)] rounded-lg w-full read-only:bg-[var(--color-bg-accent)]"/>
                                            </div>
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={() => removeItemPayer([Number(p[0]), p[1]])} className="text-[var(--color-bad)]">
                                            X
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            {
                                showNoItemPayersErrorMessage &&
                                <div className="text-[var(--color-bad)] text-sm md:text-lg text-center">
                                    Item must have payers.
                                </div>
                            }

                            <div className="flex justify-end gap-4">
                                <button type="button" onClick={() => setIsOpen(false)}>Cancel</button>
                                <button type="submit">Add Item</button>
                            </div>
                        </form>
                    </DialogPanel>
                    </div>
                </Dialog>

                <div className="w-full">
                    <hr className="border-t border-[var(--color-border)] my-2" />
                </div>

                <div
                    className="grid grid-rows-3 justify-center gap-2 w-full">
                    {/* Gratituity */}
                    <ToggleSelect
                        toggleName="Gratuity Type:"
                        leftLabel="%"
                        rightLabel="Flat"
                        leftDefault={formData.isGratuityTypePercent}
                        onChange={(isPercent) => setIsGratuityPertcent(isPercent)}
                    />
                    <div
                        className="grid grid-cols-[auto_1fr] gap-3 ">
                        <div
                            className="flex place-items-center h-full w-full">
                            Gratuity Amount:
                        </div>
                        <div className={`grid ${isGratuityPertcent ? "grid grid-cols-[1fr_auto]" : "grid grid-cols-[auto_1fr]"} place-items-start h-full align-center w-max`}>
                            <div
                                className={`${isGratuityPertcent ? "hidden" : ""} flex place-items-center h-full w-full`}>
                                $
                            </div>
                            <input 
                                type="number" 
                                id="create-activity-gratuity-amount" 
                                name="gratuity-amount" 
                                step={isGratuityPertcent ? "1" : "0.01"}
                                value={gratuityAmount}
                                onChange={(e) => {
                                    const val = e.target.value;

                                    if (val == "") {
                                        setGratuityAmount("")
                                        return;
                                    }

                                    setGratuityAmount(Number(e.target.value))
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "e" || e.key === "E" || e.key === "+" || e.key === "-") {
                                    e.preventDefault();
                                    }
                                }}
                                className="p-3 bg-[var(--color-background)] rounded-lg w-20"/>
                            <div
                                className={`${isGratuityPertcent ? "" : "hidden"} flex place-items-center h-full`}>
                                %
                            </div>
                        </div>
                    </div>
                    {
                        showGratuityErrorMessage &&
                        <div className="text-[var(--color-bad)] text-sm md:text-lg">
                            Must add a gratuity amount!
                        </div>
                    }

                    {/* Tax */}
                    <ToggleSelect
                        toggleName="Include 5% tax?"
                        leftLabel="Yes"
                        rightLabel="No"
                        leftDefault={formData.addFivePercentTax}
                        onChange={(yesTax) => setIncludeTax(yesTax)}
                    />
                </div>
                
                <div
                    className="grid grid-cols-2 w-full gap-2">
                    {/* Cancel Button */}
                    <button
                        type="button"
                        onClick={() => {
                            router.push(`../`);
                        }}
                        className="bg-[var(--color-bad)] hover:bg-[var(--color-bad-accent)] text-[var(--color-foreground)] rounded-lg p-3 w-full">
                        Cancel
                    </button>
                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="bg-[var(--color-good)] hover:bg-[var(--color-good-accent)] text-[var(--color-foreground)] rounded-lg p-3 w-full">
                        {formData.isCreatingActivity ? "Create" : "Save"}
                    </button>
                </div>
                {
                    showRequestErrorMessage &&
                    <div className="text-[var(--color-bad)] text-sm md:text-lg text-center ">
                        {requestErrorMessage}
                    </div>
                }
            </form>
        </div>
    );
}