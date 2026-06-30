import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TermsModal from "../components/TermsModal";

export default function Signup() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        termsAgreed: false,
        privacyAgreed: false,
        marketingAgreed: false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [modal, setModal] = useState(null);

    function handleChange(e) {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
        setError(null);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!form.termsAgreed) {
            setError("서비스 이용약관에 동의해주세요.");
            return;
        }
        if (!form.privacyAgreed) {
            setError("개인정보 처리방침에 동의해주세요.");
            return;
        }
        if (form.password !== form.confirmPassword) {
            setError("비밀번호가 일치하지 않습니다.");
            return;
        }

        setLoading(true);
        setError(null);

        try {

            const res = await fetch("/api/users/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    password: form.password,
                    phone: form.phone,
                    termsAgreed: form.termsAgreed,
                    privacyAgreed: form.privacyAgreed,
                    marketingAgreed: form.marketingAgreed,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "회원가입에 실패했습니다.");
                return;
            }

            navigate("/");
        } catch {
            setError("서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
        <div className="bg-surface selection:bg-primary/10 selection:text-primary">
            <div className="flex min-h-screen flex-col md:flex-row">
                <div className="relative hidden overflow-hidden border-r border-surface-container bg-white md:flex md:w-[45%] md:flex-col md:justify-between lg:w-[50%]">
                    <div className="absolute inset-0 z-0">
                        <img
                            alt="Premium Pet Lifestyle"
                            className="h-full w-full object-cover opacity-[0.08] mix-blend-multiply"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBx4KqyH6nLulzauT-smVxRaVENI_wq4PL-VjiL7RaG-SYqgZcpH8lJwUwxGhQaY7n20HHQfPqGfkVWcdtdBQvazCmIisY05s5dCeePqPhrtyGRDVFMimIiggNv6v1dzbxF7ECxdgL3XPpBbkly0t5_6V-DHyUKYWBuz6i_grVooeVEL9m3Du9O17UsQ_YO0Y_4NnwKHNsoMAnOCL88isCJRHrO8HaPsSMV47QmaV4c19yswe271GXWUE5Rz49MqJhOaXIBvzz90oG6"
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-white via-white/80 to-primary/5"></div>

                        <svg
                            className="-translate-y-1/4 translate-x-1/4 absolute right-0 top-0 h-full w-auto text-primary/5"
                            fill="currentColor"
                            viewBox="0 0 100 100"
                        >
                            <circle cx="50" cy="50" fill="none" r="40" stroke="currentColor" strokeWidth="0.5"></circle>
                            <circle cx="50" cy="50" fill="none" r="30" stroke="currentColor" strokeWidth="0.2"></circle>
                        </svg>
                    </div>

                    <div className="relative z-10 flex h-full flex-col justify-between p-16 lg:p-24">
                        <div>
                            <div className="mb-16 inline-flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-[0_8px_16px_-4px_rgba(55,93,251,0.3)]">
                                    <svg
                                        fill="none"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        width="20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.41 4.41 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.59 3 22 5.41 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.35Z"
                                            fill="white"
                                        ></path>
                                    </svg>
                                </div>
                                <span className="text-xl font-extrabold tracking-tighter text-on-surface">
                  Petitel.
                </span>
                            </div>

                            <div className="max-w-xl space-y-8">
                                <div className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-4 py-1.5">
                                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary"></span>
                                    <span className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-primary">
                    PREMIUM PET CARE
                  </span>
                                </div>

                                <h1 className="korean-headline text-[44px] font-black text-on-surface lg:text-[56px]">
                                    가장 소중한 친구를 위한
                                    <br />
                                    <span className="text-primary">프리미엄 펫케어 서비스</span>
                                </h1>

                                <p className="max-w-md text-lg font-medium leading-relaxed text-on-surface-variant lg:text-xl">
                                    호텔, 미용, 케어 예약까지 우리 아이를 위한 서비스를
                                    한곳에서 편리하게 이용해보세요.
                                </p>
                            </div>
                        </div>

                        <div className="mt-auto flex items-end justify-between border-t border-surface-container pt-12">
                            <div className="flex flex-col gap-4">
                                <div className="flex -space-x-3">
                                    <img
                                        alt="Client"
                                        className="h-12 w-12 rounded-full border-2 border-white object-cover ring-1 ring-surface-container"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCY3uHrrhMTZXQthG8NAsqm3ftLOYSWkQQM2mdr-OZh5-fycYElIiDyLyiIzoP5axdXc5a0i8CwY4HWaO7RMho6tBZVrH157ixQEcEZZ3OBH1ex_GkkvoJmvY704GOOg4r7Bfdpwgtg5BJiJ6t_XFZ--dOM5lKqIGyAKJjKUrw1tsHcys6V42RfwMtI5cl_J5IApPfKJhQrUtiLkdjaOfcEL52medW-XzRsRWcmBiGO5-uWVwVamRpaxevfv6-m_vo-ax2hbGgCuPxB"
                                    />
                                    <img
                                        alt="Client"
                                        className="h-12 w-12 rounded-full border-2 border-white object-cover ring-1 ring-surface-container"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-jdEYs9v3BGutknzrjVmFORbHZ29UrPim9XlEk4HyHestWuDfqBiP7EqU6XsK47azvHmwNdOzJ05aChN-Pv9Zi3zKEHzmrJpjMYdHc9DTob6BvetRGusJvdML5E7UbmRX1NXJ2-z1k70Pg6l0HaPnKN7ZlzpiC2agpwCO99S6y-2tiwBf5SRP4cJSIF_ARNAEW0MjUGmABTj44t1KNtBATYffCAWcn6PqxLvOPurnQOnH8oWntTfKKCbMUJ4IpjKOdpAX1XcayIHu"
                                    />
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-primary/10 ring-1 ring-surface-container">
                                        <span className="text-[10px] font-bold text-primary">10k+</span>
                                    </div>
                                </div>

                                <div>
                                    <div className="mb-1 flex gap-0.5">
                                        <span className="material-symbols-outlined fill-1 text-[16px] text-primary">star</span>
                                        <span className="material-symbols-outlined fill-1 text-[16px] text-primary">star</span>
                                        <span className="material-symbols-outlined fill-1 text-[16px] text-primary">star</span>
                                        <span className="material-symbols-outlined fill-1 text-[16px] text-primary">star</span>
                                        <span className="material-symbols-outlined fill-1 text-[16px] text-primary">star</span>
                                    </div>
                                    <p className="text-[13px] font-bold text-on-surface">
                                        많은 반려인이 선택한 서비스
                                    </p>
                                </div>
                            </div>

                            <div className="hidden text-right lg:block">
                                <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-outline">
                                    Seoul • Tokyo • New York
                                </p>
                                <p className="text-xs font-medium text-on-surface/60">
                                    © 2026 Petitel International
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <main className="relative flex min-h-screen flex-1 flex-col items-center justify-center bg-white p-6 md:p-12 lg:p-24">
                    <div className="absolute left-10 top-10 md:left-14 md:top-14">
                        <button
                            className="group flex items-center gap-3 text-outline transition-all hover:text-primary"
                            onClick={() => navigate("/")}
                            type="button"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant transition-all group-hover:border-primary/20 group-hover:bg-primary/[0.03]">
                                <span className="material-symbols-outlined text-lg">arrow_back</span>
                            </div>
                            <span className="text-sm font-bold tracking-tight">Back to Home</span>
                        </button>
                    </div>

                    <div className="w-full max-w-md space-y-10">
                        <div className="mb-12 flex items-center gap-3 md:hidden">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
                                <svg
                                    fill="none"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    width="20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.41 4.41 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.59 3 22 5.41 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.35Z"
                                        fill="white"
                                    ></path>
                                </svg>
                            </div>
                            <span className="text-2xl font-black tracking-tighter text-on-surface">
                Petitel
              </span>
                        </div>

                        <div>
                            <h2 className="text-3xl font-extrabold tracking-tight text-on-surface">
                                회원가입
                            </h2>
                            <p className="mt-2 font-medium text-on-surface-variant">
                                Petitel 회원으로 가입하고 다양한 펫케어 서비스를 이용해보세요.
                            </p>
                        </div>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="space-y-2">
                                <label
                                    className="ml-0.5 block text-[11px] font-black uppercase tracking-widest text-on-surface opacity-50"
                                    htmlFor="name"
                                >
                                    이름
                                </label>
                                <div className="group relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-xl text-outline/40 transition-colors group-focus-within:text-primary">
                    person
                  </span>
                                    <input
                                        className="w-full rounded-xl border border-transparent bg-surface-container-low py-4 pl-12 pr-4 text-on-surface outline-none transition-all placeholder:text-outline/40 focus:border-primary/20 focus:bg-white focus:ring-4 focus:ring-primary/5"
                                        id="name"
                                        name="name"
                                        placeholder="이름을 입력하세요"
                                        type="text"
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label
                                    className="ml-0.5 block text-[11px] font-black uppercase tracking-widest text-on-surface opacity-50"
                                    htmlFor="email"
                                >
                                    이메일
                                </label>
                                <div className="group relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-xl text-outline/40 transition-colors group-focus-within:text-primary">
                    alternate_email
                  </span>
                                    <input
                                        className="w-full rounded-xl border border-transparent bg-surface-container-low py-4 pl-12 pr-4 text-on-surface outline-none transition-all placeholder:text-outline/40 focus:border-primary/20 focus:bg-white focus:ring-4 focus:ring-primary/5"
                                        id="email"
                                        name="email"
                                        placeholder="이메일을 입력하세요"
                                        type="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label
                                    className="ml-0.5 block text-[11px] font-black uppercase tracking-widest text-on-surface opacity-50"
                                    htmlFor="phone"
                                >
                                    휴대폰 번호
                                </label>
                                <div className="group relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-xl text-outline/40 transition-colors group-focus-within:text-primary">
                    call
                  </span>
                                    <input
                                        className="w-full rounded-xl border border-transparent bg-surface-container-low py-4 pl-12 pr-4 text-on-surface outline-none transition-all placeholder:text-outline/40 focus:border-primary/20 focus:bg-white focus:ring-4 focus:ring-primary/5"
                                        id="phone"
                                        name="phone"
                                        placeholder="휴대폰 번호를 입력하세요"
                                        type="tel"
                                        value={form.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label
                                        className="ml-0.5 block text-[11px] font-black uppercase tracking-widest text-on-surface opacity-50"
                                        htmlFor="password"
                                    >
                                        비밀번호
                                    </label>
                                    <div className="group relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-xl text-outline/40 transition-colors group-focus-within:text-primary">
                      lock_open
                    </span>
                                        <input
                                            className="w-full rounded-xl border border-transparent bg-surface-container-low py-4 pl-12 pr-4 text-on-surface outline-none transition-all placeholder:text-outline/40 focus:border-primary/20 focus:bg-white focus:ring-4 focus:ring-primary/5"
                                            id="password"
                                            name="password"
                                            placeholder="••••••••"
                                            type="password"
                                            value={form.password}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label
                                        className="ml-0.5 block text-[11px] font-black uppercase tracking-widest text-on-surface opacity-50"
                                        htmlFor="confirmPassword"
                                    >
                                        비밀번호 확인
                                    </label>
                                    <div className="group relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-xl text-outline/40 transition-colors group-focus-within:text-primary">
                      verified
                    </span>
                                        <input
                                            className="w-full rounded-xl border border-transparent bg-surface-container-low py-4 pl-12 pr-4 text-on-surface outline-none transition-all placeholder:text-outline/40 focus:border-primary/20 focus:bg-white focus:ring-4 focus:ring-primary/5"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            placeholder="••••••••"
                                            type="password"
                                            value={form.confirmPassword}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 pt-2">
                                <div className="flex items-start gap-3">
                                    <input
                                        className="mt-0.5 h-5 w-5 cursor-pointer rounded-md border-outline-variant/50 bg-surface-container-low text-primary focus:ring-primary/20"
                                        id="termsAgreed"
                                        name="termsAgreed"
                                        type="checkbox"
                                        checked={form.termsAgreed}
                                        onChange={handleChange}
                                    />
                                    <label
                                        className="text-[13px] font-medium leading-relaxed text-on-surface-variant"
                                        htmlFor="termsAgreed"
                                    >
                                        <button
                                            type="button"
                                            className="font-bold text-primary hover:underline"
                                            onClick={() => setModal("terms")}
                                        >서비스 이용약관</button>에 동의합니다.{" "}
                                        <span className="text-red-400">(필수)</span>
                                    </label>
                                </div>
                                <div className="flex items-start gap-3">
                                    <input
                                        className="mt-0.5 h-5 w-5 cursor-pointer rounded-md border-outline-variant/50 bg-surface-container-low text-primary focus:ring-primary/20"
                                        id="privacyAgreed"
                                        name="privacyAgreed"
                                        type="checkbox"
                                        checked={form.privacyAgreed}
                                        onChange={handleChange}
                                    />
                                    <label
                                        className="text-[13px] font-medium leading-relaxed text-on-surface-variant"
                                        htmlFor="privacyAgreed"
                                    >
                                        <button
                                            type="button"
                                            className="font-bold text-primary hover:underline"
                                            onClick={() => setModal("privacy")}
                                        >개인정보 처리방침</button>에 동의합니다.{" "}
                                        <span className="text-red-400">(필수)</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <input
                                    className="mt-0.5 h-5 w-5 cursor-pointer rounded-md border-outline-variant/50 bg-surface-container-low text-primary focus:ring-primary/20"
                                    id="marketingAgreed"
                                    name="marketingAgreed"
                                    type="checkbox"
                                    checked={form.marketingAgreed}
                                    onChange={handleChange}
                                />
                                <label
                                    className="text-[13px] font-medium leading-relaxed text-on-surface-variant"
                                    htmlFor="marketingAgreed"
                                >
                                    마케팅 정보 수신에 동의합니다. <span className="text-outline/60">(선택)</span>
                                </label>
                            </div>

                            {error && (
                                <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                                    {error}
                                </div>
                            )}

                            <div className="pt-4">
                                <button
                                    className="btn-gradient flex w-full items-center justify-center gap-2 rounded-full py-4 text-lg font-extrabold text-white shadow-[0_16px_32px_-8px_rgba(55,93,251,0.25)] transition-all duration-300 hover:shadow-[0_20px_40px_-8px_rgba(55,93,251,0.35)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                                            처리 중...
                                        </>
                                    ) : (
                                        <>
                                            회원가입
                                            <span className="material-symbols-outlined text-xl">arrow_forward</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="relative flex items-center py-4">
                                <div className="flex-grow border-t border-outline-variant/20"></div>
                                <span className="mx-4 flex-shrink text-[10px] font-black uppercase tracking-[0.2em] text-outline/60">
                 간편 가입
                </span>
                                <div className="flex-grow border-t border-outline-variant/20"></div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <button
                                    aria-label="Sign up with Google"
                                    className="group flex h-14 items-center justify-center rounded-2xl border border-outline-variant/30 bg-white transition-all hover:border-outline-variant/60 hover:shadow-md"
                                    type="button"
                                >
                                    <svg className="h-6 w-6" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                                    </svg>
                                </button>

                                <button
                                    aria-label="Sign up with Apple"
                                    className="group flex h-14 items-center justify-center rounded-2xl bg-[#000000] transition-all hover:opacity-90"
                                    type="button"
                                >
                                    <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 384 512">
                                        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"></path>
                                    </svg>
                                </button>

                                <button
                                    aria-label="Sign up with Kakao"
                                    className="group flex h-14 items-center justify-center rounded-2xl bg-[#FEE500] transition-all hover:opacity-95"
                                    type="button"
                                    onClick={() => {
                                        const forceLogin = localStorage.getItem('kakao_force_login') === 'true';
                                        localStorage.removeItem('kakao_force_login');
                                        window.location.href = "http://localhost:8080/oauth2/authorization/kakao" + (forceLogin ? "?prompt_login=true" : "");
                                    }}
                                >
                                    <svg className="h-6 w-6 text-[#3C1E1E]" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 3c-5.523 0-10 3.582-10 8c0 2.872 1.848 5.378 4.595 6.911l-.947 3.473c-.092.337.28.614.56.43l4.1-2.704c.548.06 1.11.09 1.692.09 5.523 0 10-3.582 10-8s-4.477-8-10-8z"></path>
                                    </svg>
                                </button>
                            </div>

                            <div className="pt-6 text-center">
                                <p className="text-[13px] font-medium text-on-surface-variant">
                                    이미 계정이 있으신가요?
                                    <a
                                        className="ml-1.5 font-black text-primary transition-colors hover:underline"
                                        href="#"
                                    >
                                        로그인
                                    </a>
                                </p>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>


            {modal && (
                <TermsModal
                    type={modal}
                    onClose={() => setModal(null)}
                    onAgree={() => setForm((prev) => ({
                        ...prev,
                        [modal === "terms" ? "termsAgreed" : "privacyAgreed"]: true,
                    }))}
                />
            )}
        </>
    );
}
