import RoomEditor from "@/components/RoomEditor";

export default function Page() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#0a0a0a] text-white overflow-hidden">
            <RoomEditor />
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10 pointer-events-none" />
        </main>
    );
}
