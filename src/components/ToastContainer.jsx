import { useToastStore } from '../utils/toast';

export default function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const remove = useToastStore((s) => s.remove);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-6 right-6 z-9999 flex flex-col gap-2 max-w-sm">
    {/* <div className="fixed bottom-6 right-6 z-9999 flex flex-col gap-2 max-w-sm"> */}
      {toasts.map((t) => (
        <div
          key={t.id}
          onClick={() => remove(t.id)}
          className={`px-4 py-3 rounded-xl shadow-lg text-sm font-semibold cursor-pointer ${
            t.type === 'error' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
