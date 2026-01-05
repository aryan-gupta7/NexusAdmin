import { getWrappedStats } from "@/actions/wrapped";
import { WrappedStory } from "@/components/wrapped/WrappedStory";

export default async function WrappedPage() {
    const stats = await getWrappedStats();

    return <WrappedStory stats={stats} />;
}
