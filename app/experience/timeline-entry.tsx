import { Badge } from "@/components/ui/badge";
import type { Experience } from "@/lib/types";

interface TimelineEntryProps {
    experience: Experience;
    isLast: boolean;
}

export function TimelineEntry({ experience, isLast }: TimelineEntryProps) {
    return (
        <div className="grid grid-cols-[1fr] gap-x-8 md:grid-cols-[140px_1fr]">
            <div className="hidden pt-6 text-right md:block">
                <span className="text-sm font-medium text-muted-foreground">
                    {experience.period}
                </span>
            </div>

            <div className={`relative pl-8 ${isLast ? "" : "pb-6"}`}>
                {!isLast && (
                    <div className="absolute top-8 bottom-0 left-[7px] w-px bg-linear-to-b from-primary/40 to-border" />
                )}

                <div className="absolute top-6 left-0 size-[15px] rounded-full bg-primary shadow-[0_0_0_4px_color-mix(in_oklab,var(--primary)_20%,transparent),0_0_14px_var(--primary)]" />

                <div className="glass rounded-[28px] p-5 sm:p-6">
                    <p className="mb-1 text-sm font-medium text-muted-foreground md:hidden">
                        {experience.period}
                    </p>

                    <h3 className="text-lg font-semibold tracking-tight">
                        {experience.role}
                    </h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                        {experience.company}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                        {experience.skills.map((skill) => (
                            <Badge key={skill}>{skill}</Badge>
                        ))}
                    </div>

                    {experience.responsibilities &&
                        experience.responsibilities.length > 0 && (
                            <ul className="mt-4 space-y-1.5">
                                {experience.responsibilities.map(
                                    (responsibility, index) => (
                                        <li
                                            key={index}
                                            className="text-sm leading-relaxed text-muted-foreground"
                                        >
                                            {responsibility}
                                        </li>
                                    ),
                                )}
                            </ul>
                        )}
                </div>
            </div>
        </div>
    );
}
