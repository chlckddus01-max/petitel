import { useNavigate } from 'react-router-dom'
export default function Home() {

    const showMessage = () => {
        alert('예약 페이지로 이동합니다.')
    }

    // 회원가입 페이지
    const navigate = useNavigate()

    return (
        <div className="bg-slate-50 text-slate-800 antialiased">
            <nav className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md shadow-sm">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-8">
                    <div className="text-2xl font-bold tracking-tight text-blue-600">Petitel</div>

                    <div className="hidden items-center gap-8 md:flex">
                        <a
                            className="border-b-2 border-blue-600 pb-1 text-sm font-bold text-blue-600"
                            href="#"
                        >
                            Services
                        </a>
                        <a
                            className="text-sm font-medium text-slate-600 transition-opacity duration-200 hover:text-blue-500 active:scale-95"
                            href="#"
                        >
                            Hotels
                        </a>
                        <a
                            className="text-sm font-medium text-slate-600 transition-opacity duration-200 hover:text-blue-500 active:scale-95"
                            href="#"
                        >
                            Grooming
                        </a>
                        <a
                            className="text-sm font-medium text-slate-600 transition-opacity duration-200 hover:text-blue-500 active:scale-95"
                            href="#"
                        >
                            Reservations
                        </a>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="text-sm font-medium text-slate-600 transition-opacity hover:opacity-80"
                                onClick={() => navigate('/signup')}
                        >
                            Sign Up
                        </button>
                        <button
                            className="rounded-full px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                            style={{ background: "linear-gradient(135deg, #1947e8 0%, #869aff 100%)" }}
                        >
                            Join Now
                        </button>
                    </div>
                </div>
            </nav>

            <header className="overflow-hidden bg-white px-6 pb-16 pt-32 md:pb-24 md:pt-48">
                <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
                    <div className="space-y-8">
                        <div className="inline-flex items-center rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold tracking-wide text-blue-600">
                            PREMIUM PET CARE CONCIERGE
                        </div>

                        <h1 className="text-5xl font-bold leading-[1.1] tracking-tight text-slate-900 md:text-7xl">
                            우리 아이를 위한
                            <br />
                            <span className="text-blue-600">편안한 예약</span>
                        </h1>

                        <p className="max-w-lg text-lg leading-relaxed text-slate-500 md:text-xl">
                            미용, 호텔, 데이케어를 쉽고 빠르게 예약하세요. 반려동물의 행복을 최우선으로
                            생각하는 프리미엄 케어 서비스.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <button
                                className="rounded-full px-10 py-4 text-lg font-bold text-white shadow-xl shadow-blue-500/25 transition-all active:scale-95"
                                style={{ background: "linear-gradient(135deg, #1947e8 0%, #869aff 100%)" }}
                                onClick={showMessage}
                            >
                                예약하러 가기
                            </button>
                            <button className="rounded-full bg-slate-200 px-10 py-4 text-lg font-bold text-slate-900 transition-all hover:bg-slate-300 active:scale-95">
                                서비스 보기
                            </button>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-blue-100 opacity-60 blur-3xl" />

                        <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                            <img
                                alt="Happy pet"
                                className="aspect-[4/5] w-full object-cover"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAuxkqWCF5OOToNcqlGDGy9TtzVwTFQcQXH5_dW-IcdMa77LawvdCh9zDyX5LXHyEu0GBJslbOY6-_3VQN7lUFL52jCt3s4dIW-BsC_aol3YvSw_eTjhqieC4rq2-RNtttW0rNfTL_ZyxDJMfi73Hux-zTJGD-w10l3R9Tj81JFRlbNm4A55E9-XAK1alwvtdOCXCJOBDLnMFTtexaonDFC_o6pdQ4oHPnOeqwjRynIlvSCNpS5aqE_HBHfKq9fofq3Ur_QtlHI-elQ"
                            />
                        </div>

                        <div
                            className="hidden rounded-2xl bg-white p-6 md:absolute md:-bottom-6 md:-left-6 md:block"
                            style={{ boxShadow: "0 12px 32px -4px rgba(25, 71, 232, 0.08)" }}
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                                    <span className="material-symbols-outlined">star</span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">4.9/5 Rating</p>
                                    <p className="text-xs text-slate-500">10,000+ Satisfied Pets</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <section className="bg-slate-50 px-6 py-24">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
                        <div>
                            <h2 className="mb-4 text-3xl font-bold">맞춤 서비스 카테고리</h2>
                            <p className="text-lg text-slate-500">
                                당신의 반려견에게 꼭 필요한 서비스를 선택하세요.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                        <div
                            className="group cursor-pointer rounded-3xl bg-white p-8 transition-all duration-300 hover:-translate-y-2"
                            style={{ boxShadow: "0 12px 32px -4px rgba(25, 71, 232, 0.08)" }}
                        >
                            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                                <span className="material-symbols-outlined text-3xl">content_cut</span>
                            </div>
                            <h3 className="mb-2 text-xl font-bold">미용</h3>
                            <p className="text-sm text-slate-500">전문 스타일러의 섬세한 터치</p>
                        </div>

                        <div
                            className="group cursor-pointer rounded-3xl bg-white p-8 transition-all duration-300 hover:-translate-y-2"
                            style={{ boxShadow: "0 12px 32px -4px rgba(25, 71, 232, 0.08)" }}
                        >
                            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                                <span className="material-symbols-outlined text-3xl">apartment</span>
                            </div>
                            <h3 className="mb-2 text-xl font-bold">호텔</h3>
                            <p className="text-sm text-slate-500">집처럼 편안한 프리미엄 공간</p>
                        </div>

                        <div
                            className="group cursor-pointer rounded-3xl bg-white p-8 transition-all duration-300 hover:-translate-y-2"
                            style={{ boxShadow: "0 12px 32px -4px rgba(25, 71, 232, 0.08)" }}
                        >
                            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                                <span className="material-symbols-outlined text-3xl">child_care</span>
                            </div>
                            <h3 className="mb-2 text-xl font-bold">데이케어</h3>
                            <p className="text-sm text-slate-500">친구들과 즐겁게 노는 시간</p>
                        </div>

                        <div
                            className="group cursor-pointer rounded-3xl bg-white p-8 transition-all duration-300 hover:-translate-y-2"
                            style={{ boxShadow: "0 12px 32px -4px rgba(25, 71, 232, 0.08)" }}
                        >
                            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                                <span className="material-symbols-outlined text-3xl">medical_services</span>
                            </div>
                            <h3 className="mb-2 text-xl font-bold">건강관리</h3>
                            <p className="text-sm text-slate-500">체계적인 건강 체크 리포트</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-slate-100 px-6 py-24">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-12 flex items-center justify-between">
                        <h2 className="text-3xl font-bold tracking-tight">추천 펫 샵</h2>
                        <button className="flex items-center gap-2 font-bold text-blue-600 hover:opacity-70">
                            전체보기 <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        <div
                            className="group overflow-hidden rounded-3xl bg-white transition-all hover:-translate-y-1"
                            style={{ boxShadow: "0 12px 32px -4px rgba(25, 71, 232, 0.08)" }}
                        >
                            <div className="relative h-64">
                                <img
                                    alt="Luxury Pet Shop"
                                    className="h-full w-full object-cover"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLYS09yPr64_vryRyMPBBTNlRS3gYV0oKvuK5PsxnTIm8JxSWbpsowFohfTWXwRr5lctU5lgRFJ_CLX32qJS9unHgyVgojDtOxy5JDh9gRWdd4jze__w9b3kd4GSAhxmdHyIXc78WKD-ZZXXwfUfiQTj6cgbWk61dr3fj7wAmafVtJvzst_PYKSStHlsckevoITQaKoJVvbArvNnjPZFiq4DQwSV_e4anjAiyECwW5vgmYUtK1WMxb7vpWQTFjubsj93pB3FpQkkTi"
                                />
                                <div className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-blue-600 backdrop-blur-md">
                                    미용 &amp; 호텔
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="mb-2 flex items-start justify-between">
                                    <h4 className="text-lg font-bold">블루베리 펫 스튜디오</h4>
                                    <div className="flex items-center text-sm font-bold">
                    <span className="material-symbols-outlined mr-1 text-sm text-yellow-400">
                      star
                    </span>
                                        4.9
                                    </div>
                                </div>
                                <p className="mb-4 text-sm text-slate-500">강남구 청담동 · 2.4km</p>
                                <div className="flex gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold text-slate-500">
                    가위컷전문
                  </span>
                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold text-slate-500">
                    24시상주
                  </span>
                                </div>
                            </div>
                        </div>

                        <div
                            className="group overflow-hidden rounded-3xl bg-white transition-all hover:-translate-y-1"
                            style={{ boxShadow: "0 12px 32px -4px rgba(25, 71, 232, 0.08)" }}
                        >
                            <div className="relative h-64">
                                <img
                                    alt="Pet Spa"
                                    className="h-full w-full object-cover"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrYQVHpOAiNBJww2-mDcC4DJQwn4JBjV2smiiw-sErmzbiZEm6uVtr9Lqb83Mtl_qNeR149lCh8WCSeqMY0RqAxLFv1272J9xh1RfQTWeZF7nvABBV1uglBqyl1LHGCkYvFzxxeYpb0CrIH0hU2b7HhIMHyNd-KFrdT_NnWp6pVDDPjR1C1-N8C9hKLPVFZdjUsPAAHaGpzGznRMIjYzgdnK_4Oj9umk9iKvn9cgN9wE3r5gIypdii6nH36U-sStXHH74FFItxU1mX"
                                />
                                <div className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-blue-600 backdrop-blur-md">
                                    데이케어
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="mb-2 flex items-start justify-between">
                                    <h4 className="text-lg font-bold">포우즈 빌리지</h4>
                                    <div className="flex items-center text-sm font-bold">
                    <span className="material-symbols-outlined mr-1 text-sm text-yellow-400">
                      star
                    </span>
                                        4.8
                                    </div>
                                </div>
                                <p className="mb-4 text-sm text-slate-500">송파구 문정동 · 5.1km</p>
                                <div className="flex gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold text-slate-500">
                    넓은테라스
                  </span>
                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold text-slate-500">
                    픽업가능
                  </span>
                                </div>
                            </div>
                        </div>

                        <div
                            className="group overflow-hidden rounded-3xl bg-white transition-all hover:-translate-y-1"
                            style={{ boxShadow: "0 12px 32px -4px rgba(25, 71, 232, 0.08)" }}
                        >
                            <div className="relative h-64">
                                <img
                                    alt="Pet Hotel"
                                    className="h-full w-full object-cover"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAef_Znk8cHugtKkbd_sw3lntNh58hTdUtxI_rxjZciXl6oPWVFPIUQKnTnjphOPLnhdj8C-oJ8i5Fzxvta4tKRVh9p8CXddqYO0juocCd7jzuquX0txoK6VR4mew6zJ4E53aMrk3glJURdIIgjW8W0HeIVSK7JXdHOiTix34t5YzlgG-8-bJyT8oDepszOlpe5YTOfq2bcDDVYGHUTFaXFrbNVfS9kqslqcsk3BV1uMrYg-ewzCLPF8fN1BaTrZL9X3Rf_8MVkM-c-"
                                />
                                <div className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-blue-600 backdrop-blur-md">
                                    전체 서비스
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="mb-2 flex items-start justify-between">
                                    <h4 className="text-lg font-bold">그랜드 펫 하우스</h4>
                                    <div className="flex items-center text-sm font-bold">
                    <span className="material-symbols-outlined mr-1 text-sm text-yellow-400">
                      star
                    </span>
                                        5.0
                                    </div>
                                </div>
                                <p className="mb-4 text-sm text-slate-500">마포구 연남동 · 3.8km</p>
                                <div className="flex gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold text-slate-500">
                    실시간CCTV
                  </span>
                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold text-slate-500">
                    수의사협력
                  </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-white px-6 py-24">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-4xl font-bold">진심이 담긴 후기</h2>
                        <p className="text-slate-500">이미 많은 반려인들이 Petitel과 함께하고 있습니다.</p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        <div className="space-y-4 rounded-3xl bg-slate-100 p-8">
                            <div className="flex text-blue-600">
                                <span className="material-symbols-outlined">star</span>
                                <span className="material-symbols-outlined">star</span>
                                <span className="material-symbols-outlined">star</span>
                                <span className="material-symbols-outlined">star</span>
                                <span className="material-symbols-outlined">star</span>
                            </div>
                            <p className="italic leading-relaxed text-slate-800">
                                "매번 미용 예약을 잡는게 너무 힘들었는데 Petitel 덕분에 원클릭으로
                                해결했어요. 스타일도 너무 마음에 들어요!"
                            </p>
                            <div className="flex items-center gap-3 border-t border-slate-300/30 pt-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                                    김미
                                </div>
                                <div>
                                    <p className="text-sm font-bold">김*은 님</p>
                                    <p className="text-[10px] text-slate-500">비숑 프리제 '초코' 보호자</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 rounded-3xl bg-slate-100 p-8">
                            <div className="flex text-blue-600">
                                <span className="material-symbols-outlined">star</span>
                                <span className="material-symbols-outlined">star</span>
                                <span className="material-symbols-outlined">star</span>
                                <span className="material-symbols-outlined">star</span>
                                <span className="material-symbols-outlined">star</span>
                            </div>
                            <p className="italic leading-relaxed text-slate-800">
                                "출장 때문에 급하게 호텔을 찾았는데, 실시간 피드백도 주시고 시설이 너무
                                깨끗해서 안심하고 맡겼습니다."
                            </p>
                            <div className="flex items-center gap-3 border-t border-slate-300/30 pt-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                                    박준
                                </div>
                                <div>
                                    <p className="text-sm font-bold">박*우 님</p>
                                    <p className="text-[10px] text-slate-500">래브라도 '보리' 보호자</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 rounded-3xl bg-slate-100 p-8">
                            <div className="flex text-blue-600">
                                <span className="material-symbols-outlined">star</span>
                                <span className="material-symbols-outlined">star</span>
                                <span className="material-symbols-outlined">star</span>
                                <span className="material-symbols-outlined">star</span>
                                <span className="material-symbols-outlined">star</span>
                            </div>
                            <p className="italic leading-relaxed text-slate-800">
                                "데이케어 서비스 보낼 때마다 알림장 써주시는게 너무 감동이에요. 앱
                                디자인도 깔끔하고 쓰기 편합니다."
                            </p>
                            <div className="flex items-center gap-3 border-t border-slate-300/30 pt-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                                    최서
                                </div>
                                <div>
                                    <p className="text-sm font-bold">최*희 님</p>
                                    <p className="text-[10px] text-slate-500">말티즈 '구름' 보호자</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="px-6 py-12">
                <div className="mx-auto max-w-7xl">
                    <div
                        className="relative overflow-hidden rounded-3xl p-8 text-white md:flex md:items-center md:justify-between md:gap-8 md:p-16"
                        style={{ background: "linear-gradient(135deg, #1947e8 0%, #869aff 100%)" }}
                    >
                        <div className="relative z-10 space-y-4">
                            <h2 className="text-3xl font-bold md:text-5xl">
                                지금 바로 Petitel 앱을
                                <br />
                                만나보세요
                            </h2>
                            <p className="opacity-90">첫 예약 시 10,000원 할인 쿠폰 증정!</p>

                            <div className="flex gap-4 pt-4">
                                <button className="flex items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-blue-600 transition-all active:scale-95">
                                    <span className="material-symbols-outlined">download</span>
                                    App Store
                                </button>
                                <button className="flex items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-blue-600 transition-all active:scale-95">
                                    <span className="material-symbols-outlined">download</span>
                                    Google Play
                                </button>
                            </div>
                        </div>

                        <div className="relative z-10 mt-8 w-full md:mt-0 md:w-1/3">
                            <div className="aspect-[9/16] rotate-6 transform rounded-3xl border border-white/20 bg-black/10 p-2 shadow-2xl backdrop-blur-md transition-transform duration-500 hover:rotate-0">
                                <div className="h-full w-full overflow-hidden rounded-2xl bg-white">
                                    <img
                                        alt="App interface preview"
                                        className="h-full w-full object-cover"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrNemeXfPVCTNEr773EkZ4MTVc6zulmCdOy6uPiB7vWThqA9E8Qd3P-bVE4C8AYcQK67fv4oheFdqOQ2yDMNohUTcEt3msmsUG9EXURJVbuevlT8JCLJM5hVTiG3DHXo4o0vNW-oeNXFS7WPXRY70h2vqoME4NpuvATkKJIdVRsD8oYZKnNmKDJhR5acPs46MU2iuMrY-ZPE_WOV7wQmVrTSm6MXVFXXjr8Wxny8-fdbNCEF2SIKls0JCA121BWtFZfMY8-u62M4Lj"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="w-full rounded-t-3xl bg-slate-50">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between px-12 py-10 md:flex-row">
                    <div className="mb-6 md:mb-0">
                        <div className="mb-2 text-lg font-bold text-slate-900">Petitel</div>
                        <p className="text-xs text-slate-500">© 2026 Petitel. Elevated Pet Care.</p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-8">
                        <a
                            className="text-xs text-slate-500 underline decoration-blue-500/30 underline-offset-4 transition-colors duration-300 hover:text-blue-500"
                            href="#"
                        >
                            Privacy Policy
                        </a>
                        <a
                            className="text-xs text-slate-500 underline decoration-blue-500/30 underline-offset-4 transition-colors duration-300 hover:text-blue-500"
                            href="#"
                        >
                            Terms of Service
                        </a>
                        <a
                            className="text-xs text-slate-500 underline decoration-blue-500/30 underline-offset-4 transition-colors duration-300 hover:text-blue-500"
                            href="#"
                        >
                            Contact Us
                        </a>
                        <a
                            className="text-xs text-slate-500 underline decoration-blue-500/30 underline-offset-4 transition-colors duration-300 hover:text-blue-500"
                            href="#"
                        >
                            Help Center
                        </a>
                    </div>

                    <div className="mt-8 flex gap-4 md:mt-0">
            <span className="material-symbols-outlined cursor-pointer text-slate-400 transition-colors hover:text-blue-600">
              language
            </span>
                        <span className="material-symbols-outlined cursor-pointer text-slate-400 transition-colors hover:text-blue-600">
              notifications
            </span>
                    </div>
                </div>
            </footer>

            <div className="fixed bottom-6 left-6 right-6 z-50 md:hidden">
                <div className="flex items-center justify-around rounded-full border border-white/20 bg-white/80 p-2 shadow-2xl backdrop-blur-xl">
                    <a className="flex flex-col items-center p-2 text-blue-600" href="#">
                        <span className="material-symbols-outlined">home</span>
                        <span className="mt-1 text-[10px] font-bold">홈</span>
                    </a>
                    <a className="flex flex-col items-center p-2 text-slate-400" href="#">
                        <span className="material-symbols-outlined">search</span>
                        <span className="mt-1 text-[10px] font-medium">검색</span>
                    </a>
                    <a className="flex flex-col items-center p-2 text-slate-400" href="#">
                        <span className="material-symbols-outlined">calendar_month</span>
                        <span className="mt-1 text-[10px] font-medium">예약</span>
                    </a>
                    <a className="flex flex-col items-center p-2 text-slate-400" href="#">
                        <span className="material-symbols-outlined">person</span>
                        <span className="mt-1 text-[10px] font-medium">프로필</span>
                    </a>
                </div>
            </div>
        </div>
    )
}