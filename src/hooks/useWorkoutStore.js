import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'dad_will_get_jacked_data_v1';

const defaultExercises = [
    { id: '1', name: 'Bench Press', bodyParts: ['Chest', 'Arms'] },
    { id: '2', name: 'Squat', bodyParts: ['Legs'] },
    { id: '3', name: 'Deadlift', bodyParts: ['Back', 'Legs'] },
    { id: '4', name: 'Overhead Press', bodyParts: ['Shoulders', 'Arms'] },
    { id: '5', name: 'Pull Up', bodyParts: ['Back', 'Arms'] },
    { id: '6', name: 'Dumbbell Curl', bodyParts: ['Arms'] },
    { id: '7', name: 'Tricep Extension', bodyParts: ['Arms'] },
    { id: '8', name: 'Leg Press', bodyParts: ['Legs'] },
];

const initialState = {
    exercises: defaultExercises,
    history: [],
    routines: [],
    activeWorkout: null, // { id, startTime, exercises: [] }
};

export function useWorkoutStore() {
    const [data, setData] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            // Migration: Convert old single bodyPart to array if needed
            if (parsed.exercises && parsed.exercises.length > 0 && !parsed.exercises[0].bodyParts) {
                parsed.exercises = parsed.exercises.map(ex => ({
                    ...ex,
                    bodyParts: ex.bodyPart ? [ex.bodyPart] : []
                }));
            }
            return parsed;
        }
        return initialState;
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }, [data]);

    const startWorkout = (routineId = null) => {
        const newWorkout = {
            id: uuidv4(),
            startTime: new Date().toISOString(),
            exercises: [], // { exerciseId, sets: [] }
        };
        setData(prev => ({ ...prev, activeWorkout: newWorkout }));
    };

    const cancelWorkout = () => {
        setData(prev => ({ ...prev, activeWorkout: null }));
    };

    const finishWorkout = () => {
        if (!data.activeWorkout) return;
        const completedWorkout = {
            ...data.activeWorkout,
            endTime: new Date().toISOString(),
        };
        setData(prev => ({
            ...prev,
            history: [completedWorkout, ...prev.history],
            activeWorkout: null,
        }));
    };

    const addExerciseToWorkout = (exerciseId) => {
        if (!data.activeWorkout) return;
        const newExerciseLog = {
            id: uuidv4(),
            exerciseId,
            sets: [{ id: uuidv4(), weight: 0, reps: 0, completed: false }],
        };
        setData(prev => ({
            ...prev,
            activeWorkout: {
                ...prev.activeWorkout,
                exercises: [...prev.activeWorkout.exercises, newExerciseLog],
            },
        }));
    };

    const updateSet = (exerciseLogId, setId, field, value) => {
        if (!data.activeWorkout) return;
        setData(prev => {
            const updatedExercises = prev.activeWorkout.exercises.map(ex => {
                if (ex.id !== exerciseLogId) return ex;
                const updatedSets = ex.sets.map(set => {
                    if (set.id !== setId) return set;
                    return { ...set, [field]: value };
                });
                return { ...ex, sets: updatedSets };
            });
            return {
                ...prev,
                activeWorkout: { ...prev.activeWorkout, exercises: updatedExercises },
            };
        });
    };

    const addSet = (exerciseLogId) => {
        if (!data.activeWorkout) return;
        setData(prev => {
            const updatedExercises = prev.activeWorkout.exercises.map(ex => {
                if (ex.id !== exerciseLogId) return ex;
                // Copy previous set values for convenience
                const lastSet = ex.sets[ex.sets.length - 1];
                const newSet = {
                    id: uuidv4(),
                    weight: lastSet ? lastSet.weight : 0,
                    reps: lastSet ? lastSet.reps : 0,
                    completed: false
                };
                return { ...ex, sets: [...ex.sets, newSet] };
            });
            return {
                ...prev,
                activeWorkout: { ...prev.activeWorkout, exercises: updatedExercises },
            };
        });
    };

    const removeSet = (exerciseLogId, setId) => {
        if (!data.activeWorkout) return;
        setData(prev => {
            const updatedExercises = prev.activeWorkout.exercises.map(ex => {
                if (ex.id !== exerciseLogId) return ex;
                return { ...ex, sets: ex.sets.filter(s => s.id !== setId) };
            });
            return {
                ...prev,
                activeWorkout: { ...prev.activeWorkout, exercises: updatedExercises },
            };
        });
    };

    const addExercise = (name, bodyParts) => {
        const newExercise = {
            id: uuidv4(),
            name,
            bodyParts
        };
        setData(prev => ({
            ...prev,
            exercises: [...prev.exercises, newExercise]
        }));
    };

    const deleteExercise = (id) => {
        setData(prev => ({
            ...prev,
            exercises: prev.exercises.filter(e => e.id !== id)
        }));
    };

    const getExerciseName = (id) => data.exercises.find(e => e.id === id)?.name || 'Unknown';

    return {
        ...data,
        startWorkout,
        cancelWorkout,
        finishWorkout,
        addExerciseToWorkout,
        updateSet,
        addSet,
        removeSet,
        addExercise,
        deleteExercise,
        getExerciseName,
    };
}
