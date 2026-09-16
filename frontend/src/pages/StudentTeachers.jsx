import React, { useMemo } from 'react';
import { BookOpen, MessageCircle, UserSquare2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

const StudentTeachers = () => {
  const { data: schedules = [] } = useQuery({
    queryKey: ['schedules'],
    queryFn: async () => {
      const res = await api.get('/schedules');
      return res.data;
    }
  });

  // Group by subjects
  const subjectsData = useMemo(() => {
    if (!schedules) return [];
    
    const subs = {};
    schedules.forEach(s => {
      if (s.subject && s.teacher) {
        if (!subs[s.subject.name]) {
          subs[s.subject.name] = {
            subjectName: s.subject.name,
            teachers: new Map()
          };
        }
        // Add teacher to this subject if not already added
        if (!subs[s.subject.name].teachers.has(s.teacher.id)) {
            subs[s.subject.name].teachers.set(s.teacher.id, s.teacher);
        }
      }
    });

    // Convert to array
    return Object.values(subs).map(sub => ({
      ...sub,
      teachers: Array.from(sub.teachers.values())
    })).sort((a, b) => a.subjectName.localeCompare(b.subjectName));

  }, [schedules]);

  return (
    <div className="space-y-6 pb-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <UserSquare2 className="w-8 h-8 text-purple-400" /> Mes Professeurs et Modules
        </h1>
        <p className="text-sm text-slate-400 mb-6">Consultez la liste de vos modules et contactez vos professeurs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subjectsData.map((data, index) => (
          <div key={index} className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-sm shadow-xl flex flex-col">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                    <BookOpen className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-white">{data.subjectName}</h2>
            </div>
            
            <div className="space-y-4 flex-1">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Professeurs</h3>
              {data.teachers.map(teacher => (
                <div key={teacher.id} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between group hover:border-purple-500/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="relative w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center font-bold text-white shadow-inner">
                      {teacher.name.charAt(0).toUpperCase()}
                      {teacher.isOnline && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>}
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm group-hover:text-purple-400 transition-colors">{teacher.name}</p>
                      <p className="text-xs text-slate-400">Professeur</p>
                    </div>
                  </div>
                  <Link to="/dashboard/messages" state={{ activeChat: teacher }} className="p-3 bg-white/5 rounded-full text-slate-400 hover:text-white hover:bg-purple-500 transition-all" title="Contacter">
                    <MessageCircle className="w-5 h-5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))}
        {subjectsData.length === 0 && (
          <div className="col-span-1 md:col-span-2 text-center py-20 text-slate-500">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>Aucun module ou professeur trouvé.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentTeachers;