import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'dad_will_get_jacked_data_v1';

const defaultExercises = [
    { id: '1', name: 'Bench Press', bodyPart: 'Chest' },
    { id: '2', name: 'Squat', bodyPart: 'Legs' },
    { id: '3', name: 'Deadlift', bodyPart: 'Back' },
    { id: '4', name: 'Overhead Press', bodyPart: 'Shoulders' },
    { id: '5', name: 'Pull Up', bodyPart: 'Back' },
    { id: '6', name: 'Dumbbell Curl', bodyPart: 'Arms' },
    { id: '7', name: 'Tricep Extension', bodyPart: 'Arms' },
    { id: '8', name: 'Leg Press', bodyPart: 'Legs' },
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
        return saved ? JSON.parse(saved) : initialState;
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
        getExerciseName,
    };
}
