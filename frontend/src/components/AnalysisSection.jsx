import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Target, AlertCircle, CheckCircle2, ShieldCheck, Users } from 'lucide-react';
import { COMPARISON_DATA } from '../constants/data';

export const AnalysisSection = () => (
  <section id="comparison" className="py-32 px-8 bg-slate-50 relative overflow-hidden">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight text-slate-900">Market Strategy</h2>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium">How we compare against traditional models and why we win.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-20 items-center mb-20">
        <div>
          <h3 className="text-4xl font-display font-bold mb-8 leading-tight text-slate-900">
            The <span className="text-brand-primary">Amara Nexa</span> <br /> Advantage
          </h3>
          <p className="text-slate-600 text-lg mb-12 leading-relaxed font-medium">
            Traditional coding classes fail because they lack professional environment and real-world incentives. Our model bridges the gap between school and industry.
          </p>

          <div className="grid grid-cols-2 gap-6">
            {[
              { icon: TrendingUp, label: 'Engagement', value: '95%', color: 'text-brand-primary', bg: 'bg-brand-primary/10' },
              { icon: Users, label: 'Peer Learning', value: 'High', color: 'text-brand-secondary', bg: 'bg-brand-secondary/10' },
              { icon: Target, label: 'Skill Mastery', value: '92%', color: 'text-brand-accent', bg: 'bg-brand-accent/10' },
              { icon: CheckCircle2, label: 'Completion', value: '100%', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white p-6 rounded-[2rem] border border-slate-100 card-shadow">
                <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                  <stat.icon size={24} />
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-2xl font-display font-bold text-slate-900">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 card-shadow h-[500px] relative">
          <div className="absolute top-8 left-10 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Engagement Metrics</span>
          </div>

          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={COMPARISON_DATA} margin={{ top: 80, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                dy={10}
              />
              <YAxis hide />
              <Tooltip
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}
              />
              <Bar dataKey="engagement" radius={[12, 12, 0, 0]} barSize={60}>
                {COMPARISON_DATA.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.name === 'Amara Nexa' ? '#10b981' : '#e2e8f0'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          { icon: TrendingUp, title: 'The Advantage', color: 'text-brand-primary', bg: 'bg-brand-primary/10', items: ['3x higher completion rates than online.', '90% cheaper than home-based classes.'] },
          { icon: ShieldCheck, title: 'The Challenges', color: 'text-brand-secondary', bg: 'bg-brand-secondary/10', items: ['High initial setup cost per school.', 'Hardware maintenance and security.'] },
          { icon: Users, title: 'Buy-in Strategy', color: 'text-brand-accent', bg: 'bg-brand-accent/10', items: ['Future-proofing student careers.', 'Revenue share model for schools.'] }
        ].map((box) => (
          <div key={box.title} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 card-shadow">
            <div className={`${box.bg} ${box.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6`}>
              <box.icon size={28} />
            </div>
            <h4 className="text-xl font-display font-bold mb-4 text-slate-900">{box.title}</h4>
            <ul className="space-y-3">
              {box.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-500 font-medium">
                  <CheckCircle2 size={16} className="text-brand-primary mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </section>
);
