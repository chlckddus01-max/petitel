export default function ConfirmModal({ title, message, confirmText = '확인', cancelText = '취소', onConfirm, onCancel }) {
    function handleBackdrop(e) {
        if (e.target === e.currentTarget) onCancel()
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
            onClick={handleBackdrop}
        >
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
                <h2 className="text-lg font-bold text-slate-900">{title}</h2>
                {message && <p className="mt-2 text-sm text-slate-500">{message}</p>}

                <div className="mt-6 flex gap-3">
                    <button
                        className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50"
                        onClick={onCancel}
                        type="button"
                    >
                        {cancelText}
                    </button>
                    <button
                        className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-700"
                        onClick={onConfirm}
                        type="button"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    )
}
