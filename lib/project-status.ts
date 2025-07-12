"use server";

interface ProjectStatus {
    allOnline: boolean;
    updatedAt: string;
    errorMessage?: string;
}

type MonitorDetails = {
    up: boolean;
    latency: number;
    location: string;
    message: string;
};

type Monitors = {
    [key: string]: MonitorDetails;
};

type MonitorData = {
    up: number;
    down: number;
    updatedAt: number;
    monitors: Monitors;
};

export async function getProjectStatus(): Promise<ProjectStatus> {
    const response = await fetch("https://status.eglenn.dev/api/data", {
        next: { revalidate: 900 },
    });
    if (!response.ok) {
        return {
            allOnline: false,
            updatedAt: new Date().toISOString(),
            errorMessage: "Failed to fetch project status",
        };
    }

    const data = (await response.json()) as MonitorData;

    if (!data || !data.monitors) {
        return {
            allOnline: false,
            updatedAt: new Date().toISOString(),
            errorMessage: "Invalid project status data",
        };
    }

    const totalProjects = data.up + data.down;

    if (totalProjects === 0) {
        return {
            allOnline: false,
            updatedAt: new Date().toISOString(),
            errorMessage: "No monitors found",
        };
    }

    if (data.up === totalProjects) {
        return {
            allOnline: true,
            updatedAt: new Date(data.updatedAt * 1000).toISOString(),
        };
    }

    return {
        allOnline: false,
        updatedAt: new Date(data.updatedAt * 1000).toISOString(),
        errorMessage: `${data.down} of ${totalProjects} projects are down.`,
    };
}
