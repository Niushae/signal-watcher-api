export interface Event {
    id: string;
    text: string;
    summary: string;
    severity: string;
    suggestedAction: string;
    createdAt: Date;
}

export const events: Event[] = [];