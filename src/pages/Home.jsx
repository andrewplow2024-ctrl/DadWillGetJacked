import { useNavigate } from 'react-router-dom';
import { useWorkoutStore } from '../hooks/useWorkoutStore';
import { Play, ChevronRight } from 'lucide-react';

export default function HomePage() {
    const navigate = useNavigate();
    const { activeWorkout, startWorkout, history } = useWorkoutStore();

    const handleStart = () => {
        if (!activeWorkout) {
            startWorkout();
        }
        navigate('/workout');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <header>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    Let's get <span style={{ color: 'var(--accent-primary)' }}>Jacked</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
            </header>

            <section>
                <button
                    onClick={handleStart}
                    style={{
                        width: '100%',
                        padding: '2rem',
                        backgroundColor: activeWorkout ? 'var(--accent-secondary)' : 'var(--accent-primary)',
                        color: '#fff',
                        borderRadius: 'var(--radius-lg)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '1rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        fontSize: '1.25rem',
                        fontWeight: 'bold'
                    }}
                >
                    <div style={{
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        padding: '1rem',
                        borderRadius: '50%'
                    }}>
                        <Play size={32} fill="currentColor" />
                    </div>
                    {activeWorkout ? 'Resume Workout' : 'Start Empty Workout'}
                </button>
            </section>

            <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2 style={{ fontSize: '1.25rem' }}>Recent Activity</h2>
                    <button onClick={() => navigate('/history')} style={{ color: 'var(--accent-primary)', fontSize: '0.875rem' }}>View all</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {history.length === 0 ? (
                        <div style={{
                            padding: '1.5rem',
                            backgroundColor: 'var(--bg-secondary)',
                            borderRadius: 'var(--radius-md)',
                            textAlign: 'center',
                            color: 'var(--text-secondary)'
                        }}>
                            No workouts yet. Start one today!
                        </div>
                    ) : (
                        history.slice(0, 3).map(workout => (
                            <div key={workout.id} style={{
                                padding: '1rem',
                                backgroundColor: 'var(--bg-secondary)',
                                borderRadius: 'var(--radius-md)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <div style={{ fontWeight: 'bold' }}>
                                        {new Date(workout.startTime).toLocaleDateString()}
                                    </div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                        {workout.exercises.length} Exercises
                                    </div>
                                </div>
                                <ChevronRight size={20} color="var(--text-secondary)" />
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
}
