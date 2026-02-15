export type UserRole = 'admin' | 'chef' | 'cook';

export interface Profile {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    role: UserRole;
    station_id: string | null;
    created_at: string;
    updated_at: string;
}
