import { CommandDialogInput } from "./commandDialogInput"
import Image from 'next/image';

 
function Navbar() {
  return (
    <>
      {/* Navbar with full width */}
      <nav className="w-full bg-slate-100 border-b border-sky-600">
        {/* Inner container limited to 1200px */}
        <div className="max-w-[1200px] mx-auto px-4 flex items-center justify-between">
          <div className="pl-100 flex items-center gap-4">
        <Image src="/bartex.png" alt="logo" width={100} height={100}/>
          <CommandDialogInput />
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar