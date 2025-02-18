export default interface PatchBoardDetail {
    id: number;
    title: string;
    content: string;
    category: string;
    file?: File | null;
    imageUrl?: string | null;
    createdAt?: string;
}