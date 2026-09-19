import React, { useState, useEffect } from 'react';
import { Trophy, Medal, RefreshCw, X, CheckCircle2, Award } from 'lucide-react';
import { ScoreRecord } from '../types';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, onClose }) => {
  const [topScores, setTopScores] = useState<ScoreRecord[]>([]);
  const [recentScores, setRecentScores] = useState<ScoreRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'top' | 'recent'>('top');
  const [loading, setLoading] = useState(false);

  const fetchScores = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/scores');
      const data = await res.json();
      if (data.topScores) setTopScores(data.topScores);
      if (data.recentScores) setRecentScores(data.recentScores);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchScores();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="w-full max-w-xl bg-white pixel-box rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="bg-amber-400 border-b-4 border-gray-900 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Trophy className="w-6 h-6 text-amber-900" />
            <h2 className="font-pixel text-sm sm:text-base text-gray-950 font-bold">
              명예의 전당 (LEADERBOARD)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-amber-500 rounded-lg text-gray-950 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b-2 border-gray-900 bg-gray-100 p-2 gap-2">
          <button
            onClick={() => setActiveTab('top')}
            className={`flex-1 py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
              activeTab === 'top'
                ? 'bg-amber-400 text-gray-950 border-2 border-gray-900 shadow-[2px_2px_0px_#111827]'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>최고 득점 TOP 10</span>
          </button>
          <button
            onClick={() => setActiveTab('recent')}
            className={`flex-1 py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
              activeTab === 'recent'
                ? 'bg-amber-400 text-gray-950 border-2 border-gray-900 shadow-[2px_2px_0px_#111827]'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>최근 제출 기록</span>
          </button>
        </div>

        {/* Score List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-2.5">
          const list = activeTab === 'top' ? topScores : recentScores;
          {(activeTab === 'top' ? topScores : recentScores).length === 0 ? (
            <div className="text-center py-10 text-gray-500 text-sm">
              아직 기록된 점수가 없습니다. 게임을 플레이하고 첫 번째 주인공이 되어보세요!
            </div>
          ) : (
            (activeTab === 'top' ? topScores : recentScores).map((rec, idx) => (
              <div
                key={rec.id || idx}
                className="flex items-center justify-between p-3 rounded-lg border-2 border-gray-800 bg-gray-50 hover:bg-white transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-pixel text-xs font-bold border ${
                      idx === 0
                        ? 'bg-amber-400 text-amber-950 border-amber-600'
                        : idx === 1
                        ? 'bg-slate-300 text-slate-800 border-slate-500'
                        : idx === 2
                        ? 'bg-amber-700 text-white border-amber-900'
                        : 'bg-gray-200 text-gray-700 border-gray-300'
                    }`}
                  >
                    {idx + 1}
                  </span>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 text-sm">{rec.studentName}</span>
                      {rec.studentId && (
                        <span className="text-xs text-gray-500 font-mono">[{rec.studentId}]</span>
                      )}
                      {rec.cleared && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold border border-emerald-300">
                          완주
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-gray-500 flex items-center gap-2 mt-0.5">
                      <span>맞힌 문제: {rec.correctCount}/20</span>
                      <span>•</span>
                      <span>소요시간: {rec.timeTaken}초</span>
                      {rec.syncedToGoogleSheet && (
                        <span className="text-emerald-600 flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" /> 시트저장됨
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-pixel text-sm font-bold text-amber-900">
                    {rec.totalScore.toLocaleString()}P
                  </div>
                  <div className="text-[10px] text-gray-400">
                    퀴즈 {rec.quizScore} + 게임 {rec.gameScore}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-100 border-t-2 border-gray-800 p-3 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-900 text-white font-bold rounded-lg text-xs cursor-pointer hover:bg-gray-800"
          >
            닫기
          </button>
        </div>

      </div>
    </div>
  );
};
