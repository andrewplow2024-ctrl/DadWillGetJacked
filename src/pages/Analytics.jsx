import { useState, useMemo } from 'react';
import { useWorkoutStore } from '../hooks/useWorkoutStore';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899', '#6366f1'];

export default function AnalyticsPage() {
    const { history, exercises, getExerciseName } = useWorkoutStore();
    const [selectedExerciseId, setSelectedExerciseId] = useState(exercises[0]?.id);

    // 1. Body Part Split Data
    const bodyPartData = useMemo(() => {
        const counts = {};
        history.forEach(workout => {
            workout.exercises.forEach(exLog => {
                const exercise = exercises.find(e => e.id === exLog.exerciseId);
                if (exercise && exercise.bodyParts) {
                    const setsCount = exLog.sets.filter(s => s.completed).length;
                    // Count each body part separately for multi-category exercises
                    exercise.bodyParts.forEach(bodyPart => {
                        counts[bodyPart] = (counts[bodyPart] || 0) + setsCount;
                    });
                }
            });
        });
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [history, exercises]);

    // 2. Exercise Progress Data (Max Weight over time)
    const progressData = useMemo(() => {
        if (!selectedExerciseId) return [];

        const data = [];
        // Sort history by date ascending
        const sortedHistory = [...history].sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

        sortedHistory.forEach(workout => {
            const exLog = workout.exercises.find(e => e.exerciseId === selectedExerciseId);
            if (exLog) {
                const maxWeight = Math.max(...exLog.sets.filter(s => s.completed).map(s => s.weight), 0);
                if (maxWeight > 0) {
                    data.push({
                        date: new Date(workout.startTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                        weight: maxWeight
                    });
                }
            }
        });
        return data;
    }, [history, selectedExerciseId]);

    return (
        <div style={{ paddingBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Analytics</h1>

            {/* Body Part Split */}
            <section style={{ marginBottom: '2rem', backgroundColor: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Training Split (Total Sets)</h2>
                {bodyPartData.length > 0 ? (
                    <div style={{ height: '250px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={bodyPartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {bodyPartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--bg-tertiary)', border: 'none', borderRadius: 'var(--radius-sm)' }}
                                    itemStyle={{ color: 'var(--text-primary)' }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>No data yet.</p>
                )}
            </section>

            {/* Progress Chart */}
            <section style={{ backgroundColor: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2 style={{ fontSize: '1.1rem' }}>Progress (Max Weight)</h2>
                    <select
                        value={selectedExerciseId}
                        onChange={(e) => setSelectedExerciseId(e.target.value)}
                        style={{ maxWidth: '150px' }}
                    >
                        {exercises.map(ex => (
                            <option key={ex.id} value={ex.id}>{ex.name}</option>
                        ))}
                    </select>
                </div>

                {progressData.length > 0 ? (
                    <div style={{ height: '250px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={progressData}>
                                <XAxis dataKey="date" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--bg-tertiary)', border: 'none', borderRadius: 'var(--radius-sm)' }}
                                    itemStyle={{ color: 'var(--text-primary)' }}
                                />
                                <Line type="monotone" dataKey="weight" stroke="var(--accent-primary)" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>No data for this exercise.</p>
                )}
            </section>
        </div>
    );
}
