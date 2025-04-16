export const TailwindPreserveSidebarStyles = () => (
    <div className="hidden">
      {/* Common sidebar styles */}
      <div className="
        p-4 p-3 
        border-4 border-black 
        bg-red-500 bg-[#a3e636] hover:bg-[#a3e636] hover:bg-[#beee70]
        text-black text-white 
        shadow-[4px_4px_0px_black] hover:shadow-none 
        flex items-center gap-2 justify-center 
        w-[280px] w-[300px] h-screen 
        rounded-md rounded-none 
      " />
  
      {/* Variants from buttonVariants */}
      <div className="
        bg-bw text-text 
        bg-primary/5 dark:bg-secondary/30 
        hover:translate-x-1 hover:translate-y-1
      " />
  
      {/* Mobile menu buttons and ConnectWallet classes */}
      <div className="
        flex-1 flex-auto flex-col flex-row 
        bg-white bg-background 
        border-r-4 border-l-4 border-t-4 border-b-1
      " />
    </div>
  );
  