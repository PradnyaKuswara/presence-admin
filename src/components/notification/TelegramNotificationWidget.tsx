import React, { useState } from 'react';
import { Card } from '../card/Card';
import { Badge } from '../badge/Badge';
import { mockTelegramLogs, TelegramLog } from '../../data/mockSaaSData';
import { Send, CheckCircle2, Bot, RefreshCw } from 'lucide-react';

export const TelegramNotificationWidget: React.FC = () => {
  const [logs, setLogs] = useState<TelegramLog[]>(mockTelegramLogs);
  const [isSending, setIsSending] = useState<boolean>(false);

  const handleTestBroadcast = () => {
    setIsSending(true);
    setTimeout(() => {
      const newLog: TelegramLog = {
        id: `log-${Date.now()}`,
        studentName: 'Bagus Pratama',
        schoolName: 'SMPN 5 Bandung',
        recipientRole: 'Orang Tua',
        recipientName: 'Bpk. Hendra',
        messageType: 'Presensi Masuk',
        sentTime: 'Baru saja',
        status: 'delivered'
      };
      setLogs(prev => [newLog, ...prev]);
      setIsSending(false);
    }, 800);
  };

  return (
    <Card className="flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Notifikasi Telegram Bot
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Broadcast presensi ke Orang Tua & Guru PIC</p>
          </div>
          <div className="flex items-center gap-1.5">
            <Badge variant="success" size="sm">
              Bot Active
            </Badge>
          </div>
        </div>

        {/* Quick Action Button */}
        <div className="mb-4 bg-blue-50 dark:bg-blue-950/30 p-3 rounded-md border border-blue-200 dark:border-blue-800/60 flex items-center justify-between gap-2">
          <div className="text-xs text-slate-700 dark:text-slate-300">
            <p className="font-semibold text-slate-900 dark:text-slate-100">Kirim Notifikasi Uji Coba</p>
            <p className="text-[11px] text-slate-500">Kirim simulasi pesan presensi ke bot Telegram</p>
          </div>
          <button
            onClick={handleTestBroadcast}
            disabled={isSending}
            className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-md transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            {isSending ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            Tes Bot
          </button>
        </div>

        {/* Logs List */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Log Broadcast Terakhir</p>
          {logs.slice(0, 4).map(log => (
            <div
              key={log.id}
              className="p-2.5 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{log.studentName}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {log.messageType}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                  Penerima: <span className="font-medium text-slate-700 dark:text-slate-300">{log.recipientName} ({log.recipientRole})</span>
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] text-slate-400 font-mono block">{log.sentTime}</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" /> Terkirim
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3 mt-4 border-t border-slate-100 dark:border-slate-800">
        <a
          href="/telegram"
          className="text-xs text-center block w-full py-1 font-medium text-blue-600 dark:text-blue-400 hover:underline transition-colors"
        >
          Buka Pengaturan Telegram Bot &rarr;
        </a>
      </div>
    </Card>
  );
};

export default TelegramNotificationWidget;
