'use client';

import { InventoryItem } from '@/lib/explorationRoomData';

interface InventoryPanelProps {
  items: InventoryItem[];
  onClose: () => void;
}

export default function InventoryPanel({ items, onClose }: InventoryPanelProps) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative max-w-2xl w-full bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border-2 border-cyan-400/30 shadow-[0_0_50px_rgba(34,211,238,0.2)] p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
        >
          <i className="ri-close-line text-xl text-white"></i>
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg">
            <i className="ri-briefcase-line text-2xl text-white"></i>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">인벤토리</h2>
            <p className="text-sm text-cyan-400">획득한 아이템 {items.length}개</p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center bg-white/5 rounded-full">
              <i className="ri-inbox-line text-4xl text-white/30"></i>
            </div>
            <p className="text-white/50">아직 획득한 아이템이 없습니다</p>
            <p className="text-sm text-white/30 mt-2">오브젝트를 조사하여 아이템을 찾아보세요</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {items.map((item, index) => (
              <div
                key={index}
                className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/50 rounded-lg transition-all cursor-pointer group"
              >
                <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg group-hover:from-cyan-500/30 group-hover:to-blue-500/30 transition-all">
                  <i className={`${item.icon} text-3xl text-cyan-400`}></i>
                </div>
                <p className="text-center text-sm font-medium text-white">{item.name}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
          <p className="text-xs text-cyan-400 flex items-center gap-2">
            <i className="ri-information-line"></i>
            일부 오브젝트는 특정 아이템이 있어야 조사할 수 있습니다
          </p>
        </div>
      </div>
    </div>
  );
}
