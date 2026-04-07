"use client";

import { useState, useEffect } from "react";
import { Plus, Check, Target, Trophy, CheckCircle2, Circle, Flame, Calendar, CalendarDays } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getSupabase } from "@/lib/supabase";

type GoalType = "diaria" | "semanal" | "mensual";

interface Goal {
  id: string;
  text: string;
  completed: boolean;
  type: GoalType;
}

export default function GoalTracker() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoals, setNewGoals] = useState<Record<GoalType, string>>({ diaria: "", semanal: "", mensual: "" });
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabase();

  useEffect(() => {
    const fetchGoals = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      setUserId(session.user.id);
      
      const { data, error } = await supabase
        .from("metas_pacientes")
        .select("*")
        .order("created_at", { ascending: true });
        
      if (data) {
        setGoals(data.map(d => ({
          id: d.id,
          text: d.texto,
          completed: d.completada,
          type: d.tipo as GoalType
        })));
      }
      setLoading(false);
    };

    fetchGoals();
  }, [supabase]);

  const addGoal = async (type: GoalType) => {
    const text = newGoals[type].trim();
    if (!text || !userId) return;

    // Optimistic UI update for immediate response
    const tempId = `temp-${Date.now()}`;
    setGoals(prev => [...prev, { id: tempId, text, completed: false, type }]);
    setNewGoals({ ...newGoals, [type]: "" });

    // Supabase Insert
    const { data, error } = await supabase
      .from("metas_pacientes")
      .insert([
        { paciente_id: userId, texto: text, tipo: type, completada: false }
      ])
      .select()
      .single();

    if (data) {
      setGoals(prev => prev.map(g => g.id === tempId ? { id: data.id, text: data.texto, completed: data.completada, type: data.tipo as GoalType } : g));
    }
  };

  const toggleGoal = async (id: string) => {
    // Find goal to flip
    const goal = goals.find(g => g.id === id);
    if (!goal) return;
    
    // Optimistic update
    setGoals(goals.map(g => g.id === id ? { ...g, completed: !g.completed } : g));

    // Supabase Update
    await supabase
      .from("metas_pacientes")
      .update({ completada: !goal.completed })
      .eq("id", id);
  };

  const deleteGoal = async (id: string) => {
    // Optimistic delete
    setGoals(goals.filter(g => g.id !== id));

    // Supabase Delete
    await supabase
      .from("metas_pacientes")
      .delete()
      .eq("id", id);
  };

  return (
    <div className="w-full">
      {/* Tracker Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-[3rem] font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#a78bfa] drop-shadow-[0_0_15px_rgba(167,139,250,0.5)]">
          Plan de Acción y Metas
        </h2>
        <p className="text-[#a78bfa] mt-4 font-medium text-lg tracking-wide max-w-2xl mx-auto">
          Un propósito se convierte en realidad cuando lo divides en pasos. Mide tu progreso en tiempo real y celebra tus pequeñas victorias.
        </p>
      </div>

      {/* Grid Layout Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {[
          { title: "Diarias", type: "diaria" as GoalType, icon: Flame, color: "#f59e0b", accentColor: "#f59e0b" },
          { title: "Semanales", type: "semanal" as GoalType, icon: Calendar, color: "#10b981", accentColor: "#10b981" },
          { title: "Mensuales", type: "mensual" as GoalType, icon: CalendarDays, color: "#3b82f6", accentColor: "#3b82f6" }
        ].map(({ title, type, icon: Icon, color, accentColor }) => {
          const list = goals.filter(g => g.type === type);
          const completed = list.filter(g => g.completed).length;
          const progress = list.length === 0 ? 0 : Math.round((completed / list.length) * 100);

          return (
            <div key={type} className={`relative flex flex-col h-[600px] rounded-3xl border overflow-hidden transition-all duration-500`}
                 style={{ 
                   background: `linear-gradient(180deg, rgba(20,10,35,0.8) 0%, rgba(10,5,20,0.95) 100%)`, 
                   borderColor: `rgba(255,255,255,0.05)`,
                   boxShadow: `0 20px 40px rgba(0,0,0,0.5), inset 0 0 20px ${color}10`
                 }}>
              
              {/* Glow behind column */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-32 blur-[60px] opacity-20 pointer-events-none" style={{ background: color }} />

              {/* Column Header */}
              <div className="p-6 relative z-10 border-b border-white/5 flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 relative" style={{ background: `linear-gradient(135deg, ${color}20, transparent)`, border: `1px solid ${color}30` }}>
                  <Icon className="w-8 h-8" style={{ color: color }} />
                  
                  {/* Tiny circular progress inside the icon container */}
                  <svg className="absolute inset-0 w-full h-full transform -rotate-90 pointer-events-none" viewBox="0 0 36 36">
                    <path strokeDasharray={`${progress}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={color} strokeWidth="2" className="transition-all duration-1000 opacity-60" />
                  </svg>
                </div>
                <h3 className="text-2xl font-serif font-bold text-white mb-1 tracking-tight">{title}</h3>
                <p className="text-sm uppercase tracking-[0.2em] font-bold" style={{ color: color }}>{progress}% Escala</p>
              </div>

              {/* Add Input */}
              <div className="p-4 relative z-10 border-b border-white/5 bg-white/[0.01]">
                <form onSubmit={(e) => { e.preventDefault(); addGoal(type); }} className="relative flex items-center">
                  <input
                    type="text"
                    value={newGoals[type]}
                    onChange={(e) => setNewGoals({ ...newGoals, [type]: e.target.value })}
                    placeholder="Nueva meta..."
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30 transition-all placeholder:text-white/20"
                  />
                  <button type="submit" className="absolute right-2 p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                    <Plus className="w-4 h-4 text-white/50 hover:text-white" />
                  </button>
                </form>
              </div>

              {/* Goals List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar z-10 relative">
                <AnimatePresence>
                  {list.length === 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full opacity-30">
                      <Target className="w-12 h-12 mb-2 stroke-1" style={{ color }} />
                      <p className="text-xs font-medium tracking-widest uppercase">Sin Metas</p>
                    </motion.div>
                  )}
                  {list.map((g) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                      key={g.id} 
                      className={`group flex items-center gap-4 p-3.5 rounded-2xl border transition-all duration-300 relative overflow-hidden backdrop-blur-md ${
                        g.completed 
                          ? `bg-[${accentColor}]/10 border-[${accentColor}]/20` 
                          : "bg-white/[0.02] border-white/10 hover:bg-white/[0.05] hover:border-white/20"
                      }`}
                      style={g.completed ? { backgroundColor: `${color}15`, borderColor: `${color}30` } : {}}
                    >
                      {/* Completion Side Line */}
                      {g.completed && <div className="absolute left-0 top-0 bottom-0 w-1 shadow-[0_0_10px_rgba(255,255,255,0.5)]" style={{ backgroundColor: color }} />}

                      <button onClick={() => toggleGoal(g.id)} className="shrink-0 transition-transform active:scale-95 z-10">
                        {g.completed ? (
                          <CheckCircle2 className="w-6 h-6" style={{ color: color }} />
                        ) : (
                          <Circle className="w-6 h-6 text-white/20 group-hover:text-white/50 transition-colors" />
                        )}
                      </button>
                      
                      <span className={`text-[15px] flex-1 leading-snug transition-all duration-500 z-10 ${
                        g.completed ? "text-white/40 line-through decoration-white/20 font-medium" : "text-[#ebe5f5] font-medium"
                      }`}>
                        {g.text}
                      </span>

                      <button onClick={() => deleteGoal(g.id)} className="z-10 text-white/10 hover:text-red-400 p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100 hover:bg-red-500/10">
                        <Plus className="w-4 h-4 rotate-45" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.3); }
      `}</style>
    </div>
  );
}
