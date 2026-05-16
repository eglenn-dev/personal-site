import type { Experience } from "@/lib/types";

interface TimelineEntryProps {
    experience: Experience;
    isLast: boolean;
}

export function TimelineEntry({ experience, isLast }: TimelineEntryProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-x-10">
            <div className="hidden md:block pt-2 text-right">
                <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    {experience.period}
                </span>
            </div>

            <div className={`relative pl-8 ${isLast ? "" : "pb-12"}`}>
                {!isLast && (
                    <div className="absolute left-[7px] top-4 bottom-0 w-px bg-border" />
                )}

                <div className="absolute left-0 top-2 h-[15px] w-[15px] rounded-full bg-lime ring-4 ring-surface" />

                <p className="md:hidden text-xs uppercase tracking-[0.14em] text-muted-foreground mb-2">
                    {experience.period}
                </p>

                <h3 className="font-display text-3xl md:text-4xl leading-[1.05]">
                    {experience.role}
                </h3>
                <p className="text-sm text-muted-foreground mt-1.5">
                    {experience.company}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-4">
                    {experience.skills.map((skill) => (
                        <span
                            key={skill}
                            className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-surface-2 text-muted-foreground border border-border/40"
                        >
                            {skill}
                        </span>
                    ))}
                </div>

                {experience.responsibilities &&
                    experience.responsibilities.length > 0 && (
                        <ul className="mt-4 space-y-2.5">
                            {experience.responsibilities.map(
                                (responsibility, index) => (
                                    <li
                                        key={index}
                                        className="text-sm text-muted-foreground leading-relaxed pl-4 relative before:content-[''] before:absolute before:left-0 before:top-[0.6em] before:size-1 before:rounded-full before:bg-lime/60"
                                    >
                                        {responsibility}
                                    </li>
                                ),
                            )}
                        </ul>
                    )}
            </div>
        </div>
    );
}
