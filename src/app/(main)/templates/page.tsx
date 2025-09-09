import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const templates = [
  {
    title: "New Feature Announcement",
    category: "Announcement",
    image: "https://picsum.photos/600/400?random=1",
    aiHint: "technology abstract",
  },
  {
    title: "Tech Insight Infographic",
    category: "Informative",
    image: "https://picsum.photos/600/400?random=2",
    aiHint: "data visualization",
  },
  {
    title: "Quote of the Day",
    category: "Inspirational",
    image: "https://picsum.photos/600/400?random=3",
    aiHint: "nature landscape",
  },
  {
    title: "Behind the Scenes",
    category: "Team Culture",
    image: "https://picsum.photos/600/400?random=4",
    aiHint: "office people",
  },
  {
    title: "Product Mockup Showcase",
    category: "Promotion",
    image: "https://picsum.photos/600/400?random=5",
    aiHint: "product design",
  },
  {
    title: "Weekly Roundup",
    category: "Recap",
    image: "https://picsum.photos/600/400?random=6",
    aiHint: "news modern",
  },
];

export default function TemplatesPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
        <Card key={template.title} className="group overflow-hidden">
          <CardContent className="p-0">
            <div className="relative">
              <Image
                src={template.image}
                alt={template.title}
                width={600}
                height={400}
                data-ai-hint={template.aiHint}
                className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <Badge variant="secondary" className="absolute top-3 left-3">{template.category}</Badge>
            </div>
            <div className="p-4 space-y-2">
              <h3 className="font-semibold text-lg">{template.title}</h3>
              <Button className="w-full">Use Template</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
