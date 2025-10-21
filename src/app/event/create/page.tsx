import EventForm from "@/components/event-form";

export default function CreateEventPage() {
    return (
        <EventForm 
            title="Create Event"
            isCreatingEvent={true}
            eventName={undefined}
            eventDate={undefined}
            participants={undefined}
            activeParticipants={undefined}
        />
    );
}