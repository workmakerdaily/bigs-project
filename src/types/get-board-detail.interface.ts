export default interface GetBoardDetail {
    id: number;
    title: string;
    content: string;
    category: string;
    boardCategory: string;
    imageUrl?: string;
    createdAt: string;
}