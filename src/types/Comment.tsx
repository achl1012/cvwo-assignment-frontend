type Comment = {
    id: number;
    thread_id: number;
    user_id: number;
    text: string;
    user_name: string;
    created_at: Date;
};

export default Comment