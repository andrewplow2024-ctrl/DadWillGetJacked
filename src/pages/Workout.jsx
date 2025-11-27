import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkoutStore } from '../hooks/useWorkoutStore';
import { Plus, Check, Trash2, Clock, Save, X } from 'lucide-react';

export default function WorkoutPage() {
    const navigate = useNavigate();
    const {
        activeWorkout,
        exercises,
        finishWorkout,
        cancelWorkout,
        addExerciseToWorkout,
        addSet,
        updateSet,
        removeSet,
        getExerciseName
    } = useWorkoutStore();

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        if (!activeWorkout) return;
        const interval = setInterval(() => {
            const start = new Date(activeWorkout.startTime).getTime();
            const now = new Date().getTime();
            setDuration(Math.floor((now - start) / 1000));
        }, 1000);
        return () => clearInterval(interval);
    }, [activeWorkout]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleFinish = () => {
        finishWorkout();
        navigate('/history');
    };

    const handleCancel = () => {
        cancelWorkout();
        navigate('/');
    };

    if (!activeWorkout) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>No active workout.</p>
                <button
                    onClick={() => navigate('/')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: 'var(--accent-primary)',
                        color: 'white',
                        borderRadius: 'var(--radius-md)'
                    }}
                >
                    Go to Home
                </button>
            </div>
        );
    }

    return (
        <div style={{ paddingBottom: '2rem' }}>
            {/* Header */}
            <div style={{
                position: 'sticky',
                top: 0,
                backgroundColor: 'var(--bg-primary)',
                zIndex: 10,
                padding: '1rem 0',
                borderBottom: '1px solid var(--border-color)',
                marginBottom: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
                    <Clock size={20} color="var(--accent-primary)" />
                    {formatTime(duration)}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={handleCancel} style={{ padding: '0.5rem', color: 'var(--danger)' }}>
                        <X size={24} />
                    </button>
                    <button
                        onClick={handleFinish}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: 'var(--accent-secondary)',
                            color: 'white',
                            borderRadius: 'var(--radius-md)',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <Save size={18} /> Finish
                    </button>
                </div>
            </div>

            {/* Exercise List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {activeWorkout.exercises.map((exerciseLog) => (
                    <div key={exerciseLog.id} style={{
                        backgroundColor: 'var(--bg-secondary)',
                        borderRadius: 'var(--radius-md)',
                        padding: '1rem'
                    }}>
                        <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>{getExerciseName(exerciseLog.exerciseId)}</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {/* Header Row */}
                            <div style={{ display: 'grid', gridTemplateColumns: '2rem 1fr 1fr 2rem 2rem', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                                <span>Set</span>
                                <span>kg</span>
                                <span>Reps</span>
                                <span></span>
                                <span></span>
                            </div>

                            {exerciseLog.sets.map((set, index) => (
                                <div key={set.id} style={{
                                    display: 'grid',
                                    gridTemplateColumns: '2rem 1fr 1fr 2rem 2rem',
                                    gap: '0.5rem',
                                    alignItems: 'center'
                                }}>
                                    <span style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>{index + 1}</span>
                                    <input
                                        type="number"
                                        value={set.weight}
                                        onChange={(e) => updateSet(exerciseLog.id, set.id, 'weight', Number(e.target.value))}
                                        style={{ textAlign: 'center' }}
                                    />
                                    <input
                                        type="number"
                                        value={set.reps}
                                        onChange={(e) => updateSet(exerciseLog.id, set.id, 'reps', Number(e.target.value))}
                                        style={{ textAlign: 'center' }}
                                    />
                                    <button
                                        onClick={() => updateSet(exerciseLog.id, set.id, 'completed', !set.completed)}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            height: '2rem',
                                            width: '2rem',
                                            borderRadius: 'var(--radius-sm)',
                                            backgroundColor: set.completed ? 'var(--accent-secondary)' : 'var(--bg-tertiary)',
                                            color: set.completed ? 'white' : 'transparent'
                                        }}
                                    >
                                        <Check size={16} />
                                    </button>
                                    <button
                                        onClick={() => removeSet(exerciseLog.id, set.id)}
                                        style={{ color: 'var(--text-secondary)', display: 'flex', justifyContent: 'center' }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => addSet(exerciseLog.id)}
                            style={{
                                width: '100%',
                                marginTop: '1rem',
                                padding: '0.5rem',
                                backgroundColor: 'var(--bg-tertiary)',
                                color: 'var(--text-primary)',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '0.875rem'
                            }}
                        >
                            + Add Set
                        </button>
                    </div>
                ))}
            </div>

            {/* Add Exercise Button */}
            <button
                onClick={() => setIsAddModalOpen(true)}
                style={{
                    width: '100%',
                    marginTop: '2rem',
                    padding: '1rem',
                    border: '2px dashed var(--border-color)',
                    color: 'var(--text-secondary)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}
            >
                <Plus size={20} /> Add Exercise
            </button>

            {/* Add Exercise Modal */}
            {isAddModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    zIndex: 100,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-end'
                }}>
                    <div style={{
                        backgroundColor: 'var(--bg-secondary)',
                        width: '100%',
                        maxWidth: '600px',
                        height: '80vh',
                        borderTopLeftRadius: 'var(--radius-lg)',
                        borderTopRightRadius: 'var(--radius-lg)',
                        padding: '1rem',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h2 style={{ fontSize: '1.25rem' }}>Select Exercise</h2>
                            <button onClick={() => setIsAddModalOpen(false)}><X size={24} /></button>
                        </div>

                        <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {exercises.map(ex => (
                                <button
                                    key={ex.id}
                                    onClick={() => {
                                        addExerciseToWorkout(ex.id);
                                        setIsAddModalOpen(false);
                                    }}
                                    style={{
                                        padding: '1.25rem',
                                        backgroundColor: 'var(--bg-tertiary)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: 'var(--radius-md)',
                                        textAlign: 'left',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        transition: 'all 0.2s ease',
                                        cursor: 'pointer'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                                        e.currentTarget.style.borderColor = 'var(--accent-primary)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                                        e.currentTarget.style.borderColor = 'var(--border-color)';
                                    }}
                                >
                                    <span style={{ fontSize: '1rem', fontWeight: '500', color: 'var(--text-primary)' }}>{ex.name}</span>
                                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                                        {ex.bodyParts && ex.bodyParts.map((part, i) => (
                                            <span key={i} style={{
                                                fontSize: '0.75rem',
                                                color: 'var(--text-primary)',
                                                backgroundColor: 'var(--accent-primary)',
                                                padding: '0.35rem 0.75rem',
                                                borderRadius: '1rem',
                                                fontWeight: '600'
                                            }}>
                                                {part}
                                            </span>
                                        ))}
                                    </div>
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => {
                                setIsAddModalOpen(false);
                                navigate('/exercises');
                            }}
                            style={{
                                marginTop: '1rem',
                                padding: '1rem',
                                backgroundColor: 'var(--bg-primary)',
                                color: 'var(--accent-primary)',
                                borderRadius: 'var(--radius-md)',
                                border: '1px dashed var(--border-color)',
                                width: '100%',
                                fontWeight: 'bold'
                            }}
                        >
                            Manage Custom Exercises
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
