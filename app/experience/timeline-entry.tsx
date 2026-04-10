import { Badge } from "@/components/ui/badge";
import type { Experience } from "@/lib/types";

interface TimelineEntryProps {
    experience: Experience;
    isLast: boolean;
}

export function TimelineEntry({ experience, isLast }: TimelineEntryProps) {
    return (
        <div className="grid grid-cols-[1fr] md:grid-cols-[140px_1fr] gap-x-8">
            <div className="hidden md:block pt-1 text-right">
                <span className="text-sm font-medium text-muted-foreground">
                    {experience.period}
                </span>
            </div>

            <div className={`relative pl-8 ${isLast ? "" : "pb-10"}`}>
                {!isLast && (
                    <div className="absolute left-[7px] top-3 bottom-0 w-px bg-border" />
                )}

                <div className="absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border-2 border-[#0077b6] bg-background dark:border-white" />

                <p className="md:hidden text-sm font-medium text-muted-foreground mb-1">
                    {experience.period}
                </p>

                <h3 className="text-lg font-semibold text-[#0077b6] dark:text-white">
                    {experience.role}
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                    {experience.company}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-3">
                    {experience.skills.map((skill) => (
                        <Badge
                            key={skill}
                            variant="secondary"
                            className="bg-[#0077b659] hover:bg-[#0077b659] dark:bg-[#172190] hover:dark:bg-[#172190] text-xs"
                        >
                            {skill}
                        </Badge>
                    ))}
                </div>

                {experience.responsibilities &&
                    experience.responsibilities.length > 0 && (
                        <ul className="mt-3 space-y-1.5">
                            {experience.responsibilities.map(
                                (responsibility, index) => (
                                    <li
                                        key={index}
                                        className="text-sm text-muted-foreground leading-relaxed"
                                    >
                                        {responsibility}
                                    </li>
                                )
                            )}
                        </ul>
                    )}
            </div>
        </div>
    );
}
