export type Action = {
    type: "shell" | "app" | "hotkey";
    command: string;
}

export type Button = {
    id: string;
    label: string;
    icon: string;
    color: string;
    action: Action;
    longPressAction?: Action;
    position: number;
    page?: number;
}