import { create } from 'zustand';

export const useToastStore = create((set) => ({
  toasts: [],
  add: (message, type = 'success') => {
    const id = Date.now();
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 3500);
  },
  remove: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

export const toast = {
  success: (message) => useToastStore.getState().add(message, 'success'),
  error: (message) => useToastStore.getState().add(message, 'error'),
};
