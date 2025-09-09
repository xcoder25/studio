import ContentCalendar from "@/components/calendar/content-calendar";
import { Card, CardContent } from "@/components/ui/card";

export default function CalendarPage() {
  return (
    <Card>
      <CardContent className="p-0">
        <ContentCalendar />
      </CardContent>
    </Card>
  );
}
