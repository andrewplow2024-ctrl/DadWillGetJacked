import { useWorkoutStore } from '../hooks/useWorkoutStore';
import { Calendar, Clock, Dumbbell } from 'lucide-react';

export default function HistoryPage() {
    const { history, getExerciseName } = useWorkoutStore();

    const formatDate = (isoString) => {
        return new Date(isoString).toLocaleDateString(undefined, {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getDuration = (start, end) => {
        const diff = new Date(end).getTime() - new Date(start).getTime();
        const mins = Math.floor(diff / 60000);
        return `${mins} min`;
    };

    return (
        <div style={{ paddingBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Workout History</h1>

            {history.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '2rem' }}>
                    <Dumbbell size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                    <p>No completed workouts yet.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {history.map((workout) => (
                        <div key={workout.id} style={{
                            backgroundColor: 'var(--bg-secondary)',
                            borderRadius: 'var(--radius-md)',
                            padding: '1rem'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
                                    <Calendar size={16} color="var(--accent-primary)" />
                                    {formatDate(workout.startTime)}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                    <Clock size={14} />
                                    {getDuration(workout.startTime, workout.endTime)}
                                </div>
                            </div>

                            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Exercises:</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {workout.exercises.map((ex, i) => (
                                        <span key={i} style={{
                                            fontSize: '0.75rem',
                                            backgroundColor: 'var(--bg-tertiary)',
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '1rem'
                                        }}>
                                            {getExerciseName(ex.exerciseId)} ({ex.sets.filter(s => s.completed).length} sets)
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
