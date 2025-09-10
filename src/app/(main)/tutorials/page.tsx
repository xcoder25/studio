
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, PenSquare, Video, BarChart, Youtube, Cpu } from "lucide-react";
import Link from 'next/link';

const tutorials = [
  {
    title: "Getting Started with Trendix",
    description: "Learn the basics of setting up your account, connecting social profiles, and navigating the dashboard.",
    icon: <BookOpen className="size-8 text-primary" />,
    link: "#"
  },
  {
    title: "Mastering the AI Content Composer",
    description: "Dive deep into generating post ideas, writing with different tones, and finding the perfect hashtags.",
    icon: <PenSquare className="size-8 text-primary" />,
    link: "#"
  },
  {
    title: "Creating Your First AI Video",
    description: "A step-by-step guide to using the text-to-video, image-to-video, and lip-sync features.",
    icon: <Video className="size-8 text-primary" />,
    link: "#"
  },
  {
    title: "Understanding Your Analytics",
    description: "Learn how to read your engagement charts, track follower growth, and measure content performance.",
    icon: <BarChart className="size-8 text-primary" />,
    link: "#"
  },
  {
    title: "Using the YouTube Studio",
    description: "Find out how to get content ideas, analyze your video performance, and manage your YouTube presence.",
    icon: <Youtube className="size-8 text-primary" />,
    link: "#"
  },
  {
    title: "Building a Custom AI Model",
    description: "An advanced guide to creating your own Genkit flows with the Model Builder for tailored AI solutions.",
    icon: <Cpu className="size-8 text-primary" />,
    link: "#"
  }
];

export default function TutorialsPage() {
  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold">Welcome to the Trendix Learning Hub</h1>
        <p className="text-muted-foreground mt-2">
          Find guides, tutorials, and best practices to get the most out of your Trendix account.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tutorials.map((tutorial, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader className="flex-row items-start gap-4">
                {tutorial.icon}
                <div className="flex-1">
                    <CardTitle>{tutorial.title}</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription>{tutorial.description}</CardDescription>
            </CardContent>
            <CardContent>
                <Button asChild variant="outline" className="w-full">
                    <Link href={tutorial.link}>
                        Read Guide <ArrowRight className="ml-2" />
                    </Link>
                </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
