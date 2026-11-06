import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PlayerToken } from '../types';
import { TACTICS_PRESETS } from '../data/volleyballData';
import { 
  RotateCw, 
  RotateCcw, 
  PenTool, 
  Eraser, 
  Trash2, 
  Sparkles, 
  Check, 
  Info,
  Shield,
  Zap,
  Users
} from 'lucide-react';
import { soundService } from '../services/sound';

export const TacticsBoard: React.FC = () => {
  // Initial players in default 6-position formation
  const initialPlayers: PlayerToken[] = [
    { id: 'p1', role: '라이트 후위 (서브)', positionNumber: 1, name: '1번(서브)', x: 80, y: 78, color: '#EF4444' },
    { id: 'p2', role: '라이트 전위 (아포짓)', positionNumber: 2, name: '2번(전위우)', x: 78, y: 34, color: '#3B82F6' },
    { id: 'p3', role: '센터 전위 (미들블로커)', positionNumber: 3, name: '3번(전위중)', x: 50, y: 28, color: '#10B981' },
    { id: 'p4', role: '레프트 전위 (주공격수)', positionNumber: 4, name: '4번(전위좌)', x: 22, y: 34, color: '#F59E0B' },
    { id: 'p5', role: '레프트 후위 (수비/리베로)', positionNumber: 5, name: '5번(후위좌)', x: 22, y: 78, color: '#8B5CF6' },
    { id: 'p6', role: '센터 후위 (중앙 수비)', positionNumber: 6, name: '6번(후위중)', x: 50, y: 80, color: '#EC4899' },
  ];

  const [players, setPlayers] = useState<PlayerToken[]>(initialPlayers);
  const [rotationCount, setRotationCount] = useState<number>(0);
  const [activePresetId, setActivePresetId] = useState<string>('custom');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>('p1');
  const [drawingMode, setDrawingMode] = useState<boolean>(false);
  const [penColor, setPenColor] = useState<string>('#EF4444');
  const [penSize, setPenSize] = useState<number>(3);
  const [isEraser, setIsEraser] = useState<boolean>(false);

  // Canvas drawing references
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef<boolean>(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const courtContainerRef = useRef<HTMLDivElement | null>(null);

  // Dragging state for players
  const draggingPlayerId = useRef<string | null>(null);

  // Clockwise Rotation Logic:
  // 1 -> 6, 6 -> 5, 5 -> 4, 4 -> 3, 3 -> 2, 2 -> 1
  const handleRotateClockwise = () => {
    soundService.playWhistle();
    setRotationCount(prev => prev + 1);
    setActivePresetId('custom');

    setPlayers(prev => {
      // Find standard coordinates of positions 1 to 6
      const standardCoords: Record<number, { x: number; y: number }> = {
        1: { x: 80, y: 78 },
        2: { x: 78, y: 34 },
        3: { x: 50, y: 28 },
        4: { x: 22, y: 34 },
        5: { x: 22, y: 78 },
        6: { x: 50, y: 80 },
      };

      return prev.map(p => {
        // Next position in clockwise: 1->6, 6->5, 5->4, 4->3, 3->2, 2->1
        let nextPos = p.positionNumber - 1;
        if (nextPos < 1) nextPos = 6;
        const targetCoord = standardCoords[nextPos];

        return {
          ...p,
          positionNumber: nextPos,
          name: `${nextPos}번${nextPos === 1 ? '(서브)' : ''}`,
          x: targetCoord.x,
          y: targetCoord.y,
        };
      });
    });
  };

  const handleRotateCounterClockwise = () => {
    soundService.playClick();
    setRotationCount(prev => prev - 1);
    setActivePresetId('custom');

    setPlayers(prev => {
      const standardCoords: Record<number, { x: number; y: number }> = {
        1: { x: 80, y: 78 },
        2: { x: 78, y: 34 },
        3: { x: 50, y: 28 },
        4: { x: 22, y: 34 },
        5: { x: 22, y: 78 },
        6: { x: 50, y: 80 },
      };

      return prev.map(p => {
        let nextPos = p.positionNumber + 1;
        if (nextPos > 6) nextPos = 1;
        const targetCoord = standardCoords[nextPos];

        return {
          ...p,
          positionNumber: nextPos,
          name: `${nextPos}번${nextPos === 1 ? '(서브)' : ''}`,
          x: targetCoord.x,
          y: targetCoord.y,
        };
      });
    });
  };

  const handleSelectPreset = (presetId: string) => {
    soundService.playClick();
    setActivePresetId(presetId);
    const preset = TACTICS_PRESETS.find(p => p.id === presetId);
    if (preset) {
      setPlayers(preset.positions.map(p => ({
        ...p,
        name: `${p.positionNumber}번 (${p.name})`
      })));
    }
  };

  const handleResetPositions = () => {
    soundService.playClick();
    setPlayers(initialPlayers);
    setRotationCount(0);
    setActivePresetId('custom');
    clearCanvas();
  };

  // Canvas drawing helpers
  const clearCanvas = () => {
    soundService.playClick();
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  };

  const resizeCanvas = useCallback(() => {
    if (canvasRef.current && courtContainerRef.current) {
      const rect = courtContainerRef.current.getBoundingClientRect();
      canvasRef.current.width = rect.width;
      canvasRef.current.height = rect.height;
    }
  }, []);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  // Touch and Mouse handlers for Drawing Canvas
  const handleCanvasPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingMode) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    isDrawing.current = true;
    lastPoint.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleCanvasPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingMode || !isDrawing.current || !lastPoint.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
    ctx.lineTo(currentX, currentY);

    if (isEraser) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = penSize * 4;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = penColor;
      ctx.lineWidth = penSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
    ctx.stroke();

    lastPoint.current = { x: currentX, y: currentY };
  };

  const handleCanvasPointerUp = () => {
    isDrawing.current = false;
    lastPoint.current = null;
  };

  // Player Dragging
  const handlePlayerPointerDown = (e: React.PointerEvent, playerId: string) => {
    if (drawingMode) return;
    e.stopPropagation();
    draggingPlayerId.current = playerId;
    setSelectedPlayerId(playerId);
    soundService.playClick();
  };

  const handleCourtPointerMove = (e: React.PointerEvent) => {
    if (drawingMode || !draggingPlayerId.current || !courtContainerRef.current) return;
    const rect = courtContainerRef.current.getBoundingClientRect();
    const x = Math.max(5, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(5, Math.min(95, ((e.clientY - rect.top) / rect.height) * 100));

    setPlayers(prev => prev.map(p => 
      p.id === draggingPlayerId.current ? { ...p, x, y } : p
    ));
    setActivePresetId('custom');
  };

  const handleCourtPointerUp = () => {
    draggingPlayerId.current = null;
  };

  const activePlayer = players.find(p => p.id === selectedPlayerId) || players[0];

  return (
    <div className="space-y-6 animate-fadeIn select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-6 rounded-full bg-amber-500 inline-block"></span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              배구 전술 보드 & 시계방향 로테이션 시뮬레이터
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            선수 말을 드래그하여 전술을 세우고, [로테이션 회전] 버튼을 눌러 서브 순서와 자리 이동 원리를 직접 실습하세요.
          </p>
        </div>

        {/* Rotation Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleRotateClockwise}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/25 transition-all"
            title="시계 방향으로 1칸 회전 (서브권 획득 시)"
          >
            <RotateCw className="w-4 h-4 animate-spin-once" />
            <span>시계방향 로테이션 ({rotationCount}회)</span>
          </button>
          <button
            onClick={handleRotateCounterClockwise}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
            title="이전 위치로 되돌리기"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetPositions}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            초기화
          </button>
        </div>
      </div>

      {/* Preset Formation Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-500 font-bold whitespace-nowrap flex items-center gap-1">
          <Shield className="w-3.5 h-3.5 text-amber-500" />
          추천 전술 대형:
        </span>
        {TACTICS_PRESETS.map((preset) => {
          const isSelected = activePresetId === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset.id)}
              className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              {preset.name}
            </button>
          );
        })}
      </div>

      {/* Main Tactics Court & Tool Palette */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Court Canvas Area (8 cols) */}
        <div className="lg:col-span-8 flex flex-col">
          {/* Drawing Toolbar on top of court */}
          <div className="flex items-center justify-between p-2.5 rounded-t-2xl bg-slate-100 dark:bg-slate-800 border border-b-0 border-[#E9ECEF] dark:border-slate-700 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  soundService.playClick();
                  setDrawingMode(!drawingMode);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                  drawingMode
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600'
                }`}
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>{drawingMode ? '전술 펜 그리기 ON' : '선수 이동 모드'}</span>
              </button>

              {drawingMode && (
                <>
                  <button
                    onClick={() => {
                      soundService.playClick();
                      setIsEraser(false);
                    }}
                    className={`p-1.5 rounded-lg ${!isEraser ? 'bg-amber-100 dark:bg-amber-950 text-amber-600 border border-amber-300' : 'text-slate-500'}`}
                    title="펜"
                  >
                    <PenTool className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      soundService.playClick();
                      setIsEraser(true);
                    }}
                    className={`p-1.5 rounded-lg ${isEraser ? 'bg-amber-100 dark:bg-amber-950 text-amber-600 border border-amber-300' : 'text-slate-500'}`}
                    title="지우개"
                  >
                    <Eraser className="w-4 h-4" />
                  </button>

                  {/* Pen colors */}
                  <div className="flex items-center gap-1.5 pl-1">
                    {['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#FFFFFF'].map((color) => (
                      <button
                        key={color}
                        onClick={() => {
                          setPenColor(color);
                          setIsEraser(false);
                        }}
                        style={{ backgroundColor: color }}
                        className={`w-5 h-5 rounded-full border border-slate-400 shadow-sm transition-transform ${penColor === color && !isEraser ? 'scale-125 ring-2 ring-amber-400' : ''}`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={clearCanvas}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 ml-1"
                    title="그린 선 전체 지우기"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              {drawingMode ? '💡 마우스나 손가락으로 전술 이동선을 그리세요' : '💡 선수를 터치/드래그하여 원하는 위치로 이동'}
            </div>
          </div>

          {/* Interactive Court SVG + Layered Canvas */}
          <div 
            ref={courtContainerRef}
            onPointerMove={handleCourtPointerMove}
            onPointerUp={handleCourtPointerUp}
            className="relative w-full aspect-[4/3] rounded-b-2xl overflow-hidden border border-[#E9ECEF] dark:border-slate-700 bg-amber-600 shadow-inner cursor-crosshair touch-none"
            style={{ minHeight: '380px' }}
          >
            {/* SVG Court Background (9m x 9m Team Court View with Opponent Net) */}
            <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full select-none pointer-events-none">
              {/* Outer boundary */}
              <rect x="0" y="0" width="400" height="400" fill="#EA580C" />
              
              {/* Free zone border */}
              <rect x="25" y="30" width="350" height="340" fill="#F97316" stroke="#FFFFFF" strokeWidth="4" />

              {/* Net (Top) */}
              <line x1="15" y1="30" x2="385" y2="30" stroke="#1E293B" strokeWidth="8" />
              <line x1="20" y1="28" x2="380" y2="28" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="6,4" />
              <rect x="23" y="18" width="6" height="24" fill="#EF4444" />
              <rect x="371" y="18" width="6" height="24" fill="#EF4444" />

              <text x="200" y="24" fill="#FFFFFF" fontSize="11" fontWeight="800" textAnchor="middle">
                NET (네트 • 상대편 코트 방향 ⬆)
              </text>

              {/* Attack Line (3m line - 1/3 of court) */}
              <line x1="25" y1="145" x2="375" y2="145" stroke="#FFFFFF" strokeWidth="3" strokeDasharray="6,4" />
              
              {/* Attack zone label */}
              <text x="200" y="90" fill="#FEF08A" fontSize="13" fontWeight="bold" opacity="0.4" textAnchor="middle">
                전위 공격 구역 (3m ZONE)
              </text>

              {/* Back court label */}
              <text x="200" y="250" fill="#FFFFFF" fontSize="13" fontWeight="bold" opacity="0.3" textAnchor="middle">
                후위 수비 구역 (BACK ROW)
              </text>

              {/* End line service zone indicator */}
              <line x1="25" y1="370" x2="375" y2="370" stroke="#FFFFFF" strokeWidth="4" />
              <text x="200" y="388" fill="#FEF08A" fontSize="10" fontWeight="bold" textAnchor="middle">
                ◀ 엔드라인 (서브 구역) ▶
              </text>
            </svg>

            {/* Drawing Canvas Overlay */}
            <canvas
              ref={canvasRef}
              onPointerDown={handleCanvasPointerDown}
              onPointerMove={handleCanvasPointerMove}
              onPointerUp={handleCanvasPointerUp}
              className={`absolute inset-0 z-10 w-full h-full ${drawingMode ? 'pointer-events-auto cursor-pencil' : 'pointer-events-none'}`}
            />

            {/* Interactive Player Tokens */}
            {players.map((player) => {
              const isSelected = selectedPlayerId === player.id;
              const isServer = player.positionNumber === 1;

              return (
                <div
                  key={player.id}
                  onPointerDown={(e) => handlePlayerPointerDown(e, player.id)}
                  style={{
                    left: `${player.x}%`,
                    top: `${player.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className={`absolute z-20 cursor-grab active:cursor-grabbing transition-shadow flex flex-col items-center group`}
                >
                  {/* Server Badge Tag */}
                  {isServer && (
                    <div className="animate-bounce mb-1 px-1.5 py-0.5 rounded-full bg-yellow-400 text-yellow-950 text-[10px] font-black shadow-md flex items-center gap-1 border border-yellow-200">
                      <span>🏐 서브</span>
                    </div>
                  )}

                  {/* Player Token Circle */}
                  <div
                    style={{ backgroundColor: player.color }}
                    className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full text-white font-extrabold flex items-center justify-center shadow-lg border-2 transition-all ${
                      isSelected
                        ? 'border-white scale-110 ring-4 ring-yellow-400/80 shadow-yellow-500/50'
                        : 'border-white/80 hover:scale-105'
                    }`}
                  >
                    <span className="text-base sm:text-lg drop-shadow">{player.positionNumber}</span>
                  </div>

                  {/* Player label pill */}
                  <span className="mt-1 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-sm text-white text-[10px] font-semibold tracking-tight whitespace-nowrap shadow-sm">
                    {player.name}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-white dark:bg-slate-900 border border-[#E9ECEF] dark:border-slate-800 rounded-b-2xl mt-1 text-xs flex items-center justify-between">
            <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <strong>서브 주자:</strong> 현재 <span className="text-amber-500 font-bold">1번 자리(라이트 후위)</span> 선수가 서브를 넣습니다.
            </span>
            <span className="text-slate-400">
              총 {rotationCount}회 로테이션 수행됨
            </span>
          </div>
        </div>

        {/* Sidebar Info & Squad Strategy Guide (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Active Player Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#E9ECEF] dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div 
                style={{ backgroundColor: activePlayer.color }}
                className="w-10 h-10 rounded-xl text-white font-black text-xl flex items-center justify-center shadow-md"
              >
                {activePlayer.positionNumber}
              </div>
              <div>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                  선택된 선수 정보
                </span>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {activePlayer.role}
                </h3>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs space-y-1.5 mb-4">
              <div className="flex justify-between">
                <span className="text-slate-500">포지션 번호:</span>
                <strong className="text-slate-800 dark:text-slate-200">{activePlayer.positionNumber}번 자리</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">구역:</span>
                <strong className="text-slate-800 dark:text-slate-200">
                  {activePlayer.positionNumber >= 2 && activePlayer.positionNumber <= 4 ? '전위 (Front Row)' : '후위 (Back Row)'}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">서브 순서:</span>
                <strong className="text-slate-800 dark:text-slate-200">
                  {activePlayer.positionNumber === 1 ? '🔥 현재 서브 순번!' : `${activePlayer.positionNumber}번째 서브`}
                </strong>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs">
              <span className="font-bold text-amber-900 dark:text-amber-200 block mb-1">
                로테이션 핵심 원리:
              </span>
              <p className="text-amber-800 dark:text-amber-300 leading-relaxed">
                배구는 서브권을 되찾아올 때 모든 선수가 <strong>시계방향(Clockwise)</strong>으로 1칸씩 이동합니다.
                1번 선수가 6번으로 가고, 2번에 있던 선수가 1번으로 내려와 서브를 넣게 됩니다!
              </p>
            </div>
          </div>

          {/* Tactics Preset Explanation */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#E9ECEF] dark:border-slate-800 shadow-sm">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-amber-500" />
              현재 대형 설명
            </h4>
            {(() => {
              const currentPreset = TACTICS_PRESETS.find(p => p.id === activePresetId);
              if (currentPreset) {
                return (
                  <div className="text-xs space-y-2">
                    <p className="font-bold text-slate-800 dark:text-slate-200">
                      {currentPreset.name}
                    </p>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {currentPreset.description}
                    </p>
                  </div>
                );
              }
              return (
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  자유롭게 배치된 맞춤 전술 대형입니다. 상단의 [추천 전술 대형] 버튼을 누르면 W형, U형 대형으로 바로 전환됩니다.
                </p>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};
