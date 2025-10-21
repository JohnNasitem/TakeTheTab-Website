export interface GenericResponse {
  actionSuccess: boolean;
  errorMessage?: string | null;
}



// Users
export interface FetchUserResponse extends GenericResponse {
  userId?: number | null
  userDisplayName?: string | null;
  userEmail?: string | null;
  events?: Record<number, FetchUserResponseEvent> | null;
  userTotalOwed?: number | null;
  userTotalOwing?: number | null;
};

export class FetchUserResponseEvent {
  eventName!: string;
  userTotalOwed!: number;
  userTotalOwing!: number;
}




// Friends
export interface FetchUserFriendsResponse extends GenericResponse  {
  friends?: Record<number, [string, string]> | null;
  incommingFriendRequests?: Record<number, [string, string]>| null;
}



// Events
export interface CreateEventResponse extends GenericResponse{
  eventId: number| null;
}

export interface FetchEventResponse extends GenericResponse{
  createdEvent?: boolean | null;
  eventName?: string | null;
  eventDate?: Date | null;
  activities?: Record<number, FetchEventResponseActivity> | null;
  participants?: FetchEventResponseParticipant[] | null;
  activeParticipants?: number[] | null;
  userTotalOwed?: number | null;
  userTotalOwing?: number | null;
}

export interface FetchEventResponseActivity {
  activityName: string;
  owedMoney: boolean;
  amount: number;
}

export interface FetchEventResponseParticipant {
  userId: number;
  displayName: string;
  email: string;
  hasPaid: boolean;
  amountOwedToYou: number;
  paymentConfirmed: boolean;
}



// Activities
export interface CreateActivityResponse extends GenericResponse{
  activityId: number| null;
}

export interface FetchActivityResponse extends GenericResponse {
  createdActivity: boolean | null;
  activityName: string | null;
  isPayee: boolean | null;
  payee: FetchActivityResponsePayee | null;
  items: FetchActivityResponseItem[] | null;
  amount?: number | null;
  payers?: FetchActivityResponsePayer[] | null;
  addFivePercentTax?: boolean | null;
  isGratuityTypePercent?: boolean | null;
  gratuityAmount?: number | null;
  activitySubtotal?: number | null;
}

export interface FetchActivityResponsePayee {
  payeeName: string;
  payeeEmail: string;
  payerPhoneNumber: string | null;
}

export interface FetchActivityResponsePayer {
  payerId: number;
  payerName: string;
  payerEmail: string;
  amountOwing: number;
}

export interface FetchActivityResponseItem {
  itemId: number;
  itemName: string;
  itemCost: number;
  isSplitEvently: boolean;
  payers: FetchActivityResponsePayer[];
}

