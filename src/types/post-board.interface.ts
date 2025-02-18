export default interface PostBoard {
    title: string;
    content: string;
    category: string;
    file?: File | null;
    fileName?: string | null;
}