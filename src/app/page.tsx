"use client"

import { ItemProps } from "@/components/list-item";
import List from "@/components/list";
import { UserApiService } from "@/components/server-api-serivces/user-api-service"
import { useState, useEffect } from "react";
import { FetchUserResponseEvent } from '@/interfaces/server-responses'

export default function Home() {
  const { fetchUser } = UserApiService();

  const [amountOwed, setAmountOwed] = useState(0);
  const [amountOwing, setAmountOwing] = useState(0);
  const [displayName, setDisplayName] = useState("");
  const [items, setItems] = useState<ItemProps[]>([]);

  useEffect(() => {
    const getData = async () => {
      const userData = await fetchUser();

      if (!userData.actionSuccess) {
        setDisplayName("Server error!");
        setAmountOwed(0);
        setAmountOwing(0);
        setItems([]);
        return;
      }

      setDisplayName(userData.userDisplayName as string)
      setAmountOwed(userData.userTotalOwed as number)
      setAmountOwing(userData.userTotalOwing as number)
      setItems(Object.entries(userData.events as Record<number, FetchUserResponseEvent>).map(
        ([eventId, eventDetails]) => ({
          id: Number(eventId),
          name: eventDetails.eventName,
          totalOwed: eventDetails.userTotalOwed,
          totalOwing: eventDetails.userTotalOwing,
          clickLink: `/event/${eventId}`,
          showTotal: true
        })
      ));
    }

    getData();
  }, [fetchUser]);

  return (
    <div className="pageSection p-3 grid grid-rows-[auto_auto_1fr] md:grid-rows-[auto_1fr] grid-cols-2 md:grid-cols-[66fr_17fr_17fr] gap-4 h-full min-h-0">
      {/* Display name */}
      <div className="text-3xl md:text-7xl col-span-2 md:col-span-1 w-full gap-4 grid-rows-[1fr_auto] md:grid-rows-1 bg-[var(--color-bg-accent)] rounded-3xl p-5">
        <h1 className="flex justify-center justify-start md:items-center h-full font-bold">
          <span className="truncate w-full max-w-[100%] inline-block">{displayName ?? ""} </span>
        </h1>
      </div>

      {/* Owed amount */}
      <div className="grid grid-rows-[min-content_1fr] text-center bg-[var(--color-good)] rounded-3xl p-5">
          <span className="block md:inline text-2xl md:text-3xl">
              Owed
          </span>
          <div className="text-4xl md:text-6xl w-full truncate w-full max-w-[100%] inline-block">
              ${amountOwed ?? 0}
          </div>
      </div>

      {/* Debt amount */}
      <div className="grid grid-rows-[min-content_1fr] text-center bg-[var(--color-bad)] rounded-3xl p-5">
          <span className="block md:inline text-2xl md:text-3xl truncate w-full max-w-[100%] inline-block">
              Debt
          </span>
          <div className="text-4xl md:text-6xl">
              ${amountOwing ?? 0}
          </div>
      </div>
      <div className="md:col-span-3 col-span-2 h-full min-h-0">
        <List title="Events" items={items} addItemLink="/event/create" addItemText="Add Event" allowModify={true}/>
      </div>
    </div>
  );
}
