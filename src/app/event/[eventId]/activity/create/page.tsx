import ActivityForm from "@/components/activity-form" 

export default function CreateActivityPage() {
    return (
        <ActivityForm 
            title="Create Activity"
            isCreatingActivity={true}
        />
    );
}