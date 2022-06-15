export interface DbResult {
    affectedRows: number;
    insertId: number;
    message: string;
    protocol41: boolean;
    changedRows: number;
    fieldCount: number;
    serverStatus: number;
    warningCount: number;
}

export interface SDTagData {
    id: number;
    name: string;
    icon: string;
    bg_color: string;
    text_color: string;
    time_today: number;
    time_week: number;
    time_month: number;
    time_year: number;
    time_total: number;
    user: number;
}

export interface diaryData {
    id: number;
    sdtag: number;
    user: number;
    is_learning: number;
    start_at: string;
    stop_at: string;
    log: string;
}