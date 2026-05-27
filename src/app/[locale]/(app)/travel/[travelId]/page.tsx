import Travel from "@/components/travel/pages/Travel";

export default async function TravelPage({
  params,
}: {
  params: Promise<{ travelId: string }>;
}) {
  const { travelId } = await params;

  return <Travel id={travelId} />;
}
