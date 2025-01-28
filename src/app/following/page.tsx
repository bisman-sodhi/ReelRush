import NavigationMenu from '@/components/NavigationMenu';

export default function Following() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <NavigationMenu />
        <div className="w-full max-w-2xl">
          <h1 className="text-2xl font-bold text-black">Following</h1>
        </div>
      </main>
    </div>
  );
} 