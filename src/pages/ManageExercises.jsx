import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkoutStore } from '../hooks/useWorkoutStore';
import { Plus, Trash2, X, Check } from 'lucide-react';

const BODY_PART_OPTIONS = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];

export default function ManageExercisesPage() {
    const navigate = useNavigate();
    const { exercises, addExercise, deleteExercise } = useWorkoutStore();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newExerciseName, setNewExerciseName] = useState('');
    const [selectedBodyParts, setSelectedBodyParts] = useState([]);

    const handleToggleBodyPart = (part) => {
        setSelectedBodyParts(prev =>
            prev.includes(part) ? prev.filter(p => p !== part) : [...prev, part]
        );
    };

    const handleAddExercise = () => {
        if (newExerciseName.trim() && selectedBodyParts.length > 0) {
            addExercise(newExerciseName.trim(), selectedBodyParts);
            setNewExerciseName('');
            setSelectedBodyParts([]);
            setIsAddModalOpen(false);
        }
    };

    const handleDeleteExercise = (id, name) => {
        if (window.confirm(`Delete "${name}"? This cannot be undone.`)) {
            deleteExercise(id);
        }
    };

    return (
        <div style={{ paddingBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Manage Exercises</h1>
                <button onClick={() => navigate(-1)} style={{ color: 'var(--text-secondary)' }}>
                    <X size={24} />
                </button>
            </div>

            <button
                onClick={() => setIsAddModalOpen(true)}
                style={{
                    width: '100%',
                    padding: '1rem',
                    backgroundColor: 'var(--accent-primary)',
                    color: 'white',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    marginBottom: '1.5rem'
                }}
            >
                <Plus size={20} /> Add New Exercise
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {exercises.map(ex => (
                    <div
                        key={ex.id}
                        style={{
                            padding: '1rem',
                            backgroundColor: 'var(--bg-secondary)',
                            borderRadius: 'var(--radius-md)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <div>
                            <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{ex.name}</div>
                            <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                                {ex.bodyParts && ex.bodyParts.map((part, i) => (
                                    <span
                                        key={i}
                                        style={{
                                            fontSize: '0.75rem',
                                            backgroundColor: 'var(--bg-tertiary)',
                                            color: 'var(--text-secondary)',
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '1rem'
                                        }}
                                    >
                                        {part}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={() => handleDeleteExercise(ex.id, ex.name)}
                            style={{ color: 'var(--danger)', padding: '0.5rem' }}
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Add Exercise Modal */}
            {isAddModalOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        zIndex: 100,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '1rem'
                    }}
                >
                    <div
                        style={{
                            backgroundColor: 'var(--bg-secondary)',
                            width: '100%',
                            maxWidth: '500px',
                            borderRadius: 'var(--radius-lg)',
                            padding: '1.5rem'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Add New Exercise</h2>
                            <button onClick={() => setIsAddModalOpen(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                Exercise Name
                            </label>
                            <input
                                type="text"
                                value={newExerciseName}
                                onChange={(e) => setNewExerciseName(e.target.value)}
                                placeholder="e.g., Push-ups"
                                style={{ width: '100%', padding: '0.75rem' }}
                            />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                Body Parts (select all that apply)
                            </label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                                {BODY_PART_OPTIONS.map(part => (
                                    <button
                                        key={part}
                                        onClick={() => handleToggleBodyPart(part)}
                                        style={{
                                            padding: '0.75rem',
                                            backgroundColor: selectedBodyParts.includes(part) ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                                            color: selectedBodyParts.includes(part) ? 'white' : 'var(--text-primary)',
                                            borderRadius: 'var(--radius-md)',
                                            border: selectedBodyParts.includes(part) ? 'none' : '1px solid var(--border-color)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                            fontWeight: selectedBodyParts.includes(part) ? 'bold' : 'normal'
                                        }}
                                    >
                                        {selectedBodyParts.includes(part) && <Check size={16} />}
                                        {part}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleAddExercise}
                            disabled={!newExerciseName.trim() || selectedBodyParts.length === 0}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                backgroundColor: (!newExerciseName.trim() || selectedBodyParts.length === 0) ? 'var(--bg-tertiary)' : 'var(--accent-secondary)',
                                color: (!newExerciseName.trim() || selectedBodyParts.length === 0) ? 'var(--text-secondary)' : 'white',
                                borderRadius: 'var(--radius-md)',
                                fontWeight: 'bold',
                                cursor: (!newExerciseName.trim() || selectedBodyParts.length === 0) ? 'not-allowed' : 'pointer'
                            }}
                        >
                            Add Exercise
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
